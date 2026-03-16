import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Context {
  params: Promise<{ id: string }>;
}

// Boxtal API v1 base URL
const BOXTAL_API_BASE = "https://www.envoimoinscher.com/api/v1";

/**
 * Helper to call the Boxtal (EnvoiMoinsCher) API v1
 * Uses HTTP Basic auth with ACCESS_KEY:SECRET_KEY
 * API returns XML
 */
async function callBoxtalAPI(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: string
) {
  const credentials = Buffer.from(
    `${process.env.BOXTAL_ACCESS_KEY}:${process.env.BOXTAL_SECRET_KEY}`
  ).toString("base64");

  const res = await fetch(`${BOXTAL_API_BASE}${endpoint}`, {
    method,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type":
        method === "POST"
          ? "application/x-www-form-urlencoded"
          : "application/xml",
      Accept: "application/xml",
    },
    body,
  });

  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

/**
 * Simple XML value extractor (no external dependency)
 */
function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extract all values for a given XML tag
 */
function extractAllXmlValues(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`, "g");
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

/**
 * Build URL-encoded form data for Boxtal API
 */
function buildFormData(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function POST(_req: NextRequest, { params }: Context) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const order = await db.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "La commande doit être payée" },
        { status: 400 }
      );
    }

    // Calculate total weight (approximate: 300g per item, minimum 0.5kg)
    const totalWeight = Math.max(
      order.items.reduce((sum, item) => sum + item.quantity * 0.3, 0),
      0.5
    );

    // Format collection date (tomorrow or next business day)
    const collectionDate = new Date();
    collectionDate.setDate(collectionDate.getDate() + 1);
    // Skip weekends
    if (collectionDate.getDay() === 0)
      collectionDate.setDate(collectionDate.getDate() + 1);
    if (collectionDate.getDay() === 6)
      collectionDate.setDate(collectionDate.getDate() + 2);
    const formattedDate = collectionDate.toISOString().split("T")[0];

    // ─── Step 1: Get a quotation from Boxtal ───────────────────
    const quotationParams = buildFormData({
      // Sender (your warehouse/shop)
      "expediteur.pays": "FR",
      "expediteur.code_postal": "75001",
      "expediteur.ville": "Paris",
      "expediteur.type": "entreprise",
      "expediteur.adresse": "1 Rue de la Paix",
      "expediteur.civilite": "M",
      "expediteur.prenom": "ALLURAE",
      "expediteur.nom": "Shop",
      "expediteur.societe": "ALLURAE",
      "expediteur.email": "contact@allurae.fr",
      "expediteur.tel": "+33100000000",
      // Recipient
      "destinataire.pays": order.shippingCountry || "FR",
      "destinataire.code_postal": order.shippingZip || "",
      "destinataire.ville": order.shippingCity || "",
      "destinataire.type": "particulier",
      "destinataire.adresse": order.shippingAddress || "",
      "destinataire.civilite": "M",
      "destinataire.prenom": (order.shippingName || order.user.name)
        .split(" ")[0],
      "destinataire.nom":
        (order.shippingName || order.user.name).split(" ").slice(1).join(" ") ||
        (order.shippingName || order.user.name),
      "destinataire.email": order.user.email,
      "destinataire.tel": order.shippingPhone || "",
      // Parcel
      "colis_1.poids": totalWeight.toFixed(1),
      "colis_1.longueur": "30",
      "colis_1.largeur": "20",
      "colis_1.hauteur": "10",
      // Content
      code_contenu: "10120", // Clothing
      collecte: formattedDate,
      delai: "aucun",
    });

    console.log("[Boxtal] Getting quotation...");
    const quotationRes = await callBoxtalAPI(
      "/cotation",
      "POST",
      quotationParams
    );

    if (!quotationRes.ok) {
      console.error(
        "[Boxtal] Quotation failed:",
        quotationRes.status,
        quotationRes.text
      );

      // Fallback: generate with mock data if API fails
      return await generateFallbackLabel(id, order);
    }

    console.log("[Boxtal] Quotation response received");

    // Try to find a Mondial Relay offer (operator code: MONR)
    // Or any available relay point offer
    const xml = quotationRes.text;

    // Look for offer references - we need an operator and service code
    // Try Mondial Relay first, then fall back to cheapest offer
    let selectedOperator: string | null = null;
    let selectedService: string | null = null;

    // Parse offers from quotation XML
    const offerBlocks = xml.split(/<\/?offre>/g);
    let cheapestPrice = Infinity;

    for (const block of offerBlocks) {
      const operator = extractXmlValue(block, "operateur_code");
      const service = extractXmlValue(block, "service_code");
      const priceStr = extractXmlValue(block, "prix_ttc");
      const price = priceStr ? parseFloat(priceStr) : Infinity;

      if (operator === "MONR" && service) {
        // Prefer Mondial Relay
        selectedOperator = operator;
        selectedService = service;
        break;
      }

      if (operator && service && price < cheapestPrice) {
        cheapestPrice = price;
        selectedOperator = operator;
        selectedService = service;
      }
    }

    if (!selectedOperator || !selectedService) {
      console.error("[Boxtal] No suitable offer found in quotation");
      return await generateFallbackLabel(id, order);
    }

    console.log(
      `[Boxtal] Selected offer: ${selectedOperator} / ${selectedService}`
    );

    // ─── Step 2: Create the order ──────────────────────────────
    const orderParams = buildFormData({
      // Same sender/recipient info
      "expediteur.pays": "FR",
      "expediteur.code_postal": "75001",
      "expediteur.ville": "Paris",
      "expediteur.type": "entreprise",
      "expediteur.adresse": "1 Rue de la Paix",
      "expediteur.civilite": "M",
      "expediteur.prenom": "ALLURAE",
      "expediteur.nom": "Shop",
      "expediteur.societe": "ALLURAE",
      "expediteur.email": "contact@allurae.fr",
      "expediteur.tel": "+33100000000",
      "destinataire.pays": order.shippingCountry || "FR",
      "destinataire.code_postal": order.shippingZip || "",
      "destinataire.ville": order.shippingCity || "",
      "destinataire.type": "particulier",
      "destinataire.adresse": order.shippingAddress || "",
      "destinataire.civilite": "M",
      "destinataire.prenom": (order.shippingName || order.user.name)
        .split(" ")[0],
      "destinataire.nom":
        (order.shippingName || order.user.name).split(" ").slice(1).join(" ") ||
        (order.shippingName || order.user.name),
      "destinataire.email": order.user.email,
      "destinataire.tel": order.shippingPhone || "",
      // Parcel
      "colis_1.poids": totalWeight.toFixed(1),
      "colis_1.longueur": "30",
      "colis_1.largeur": "20",
      "colis_1.hauteur": "10",
      // Content
      code_contenu: "10120",
      collecte: formattedDate,
      delai: "aucun",
      // Selected offer
      "operateur": selectedOperator,
      "service": selectedService,
      // Order reference (internal)
      "raison": "order",
      "information_complementaire": `Commande ALLURAE ${order.id}`,
    });

    console.log("[Boxtal] Creating order...");
    const orderRes = await callBoxtalAPI("/order", "POST", orderParams);

    if (!orderRes.ok) {
      console.error(
        "[Boxtal] Order creation failed:",
        orderRes.status,
        orderRes.text
      );
      return await generateFallbackLabel(id, order);
    }

    console.log("[Boxtal] Order created successfully");
    const orderXml = orderRes.text;

    // Extract tracking number and label URL from response
    const trackingNumber =
      extractXmlValue(orderXml, "reference") ||
      extractXmlValue(orderXml, "tracking_number") ||
      `BXT-${Date.now().toString(36).toUpperCase()}`;

    // The Boxtal API typically returns label URLs in the response
    const labelUrl =
      extractXmlValue(orderXml, "label_url") ||
      extractXmlValue(orderXml, "url_etiquette") ||
      extractXmlValue(orderXml, "url_bordereau") ||
      null;

    // Update order in database
    await db.order.update({
      where: { id },
      data: {
        trackingNumber,
        labelUrl,
        status: "SHIPPED",
      },
    });

    return NextResponse.json({
      success: true,
      trackingNumber,
      labelUrl: labelUrl || `/admin/orders/${id}/label`,
      carrier: selectedOperator,
      service: selectedService,
      apiResponse: process.env.NODE_ENV === "development" ? orderXml : undefined,
    });
  } catch (error: any) {
    console.error("[Boxtal] Shipping label error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Fallback: If Boxtal API fails, we still update the order
 * but with a mock tracking number and no real label
 */
async function generateFallbackLabel(id: string, order: any) {
  const mockTracking = `ALLURAE-${Date.now().toString(36).toUpperCase()}`;

  await db.order.update({
    where: { id },
    data: {
      trackingNumber: mockTracking,
      status: "SHIPPED",
    },
  });

  return NextResponse.json({
    success: true,
    trackingNumber: mockTracking,
    labelUrl: `/admin/orders/${id}/label`,
    note: "Étiquette générée en mode fallback (API Boxtal indisponible). Connectez-vous à boxtal.com pour créer l'étiquette manuellement.",
    fallback: true,
  });
}
