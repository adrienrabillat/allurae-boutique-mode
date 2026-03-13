import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        // 1. Update order status to PAID and save shipping info
        const order = await db.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            shippingName: session.shipping_details?.name || null,
            shippingAddress: session.shipping_details?.address?.line1 || null,
            shippingCity: session.shipping_details?.address?.city || null,
            shippingZip: session.shipping_details?.address?.postal_code || null,
            shippingCountry: session.shipping_details?.address?.country || null,
          },
          include: {
            items: { include: { product: true } },
            user: true,
          },
        });

        // 2. Deduct stock for each product
        for (const item of order.items) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // 3. Send confirmation email via Resend
        await resend.emails.send({
          from: "ALLURAE <onboarding@resend.dev>",
          to: order.user.email,
          subject: `Commande confirmée #${order.id.slice(-8).toUpperCase()}`,
          html: `
            <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 300; color: #1A1A1A; text-align: center; letter-spacing: 8px; margin-bottom: 32px;">ALLURAE</h1>

              <h2 style="font-size: 24px; font-weight: 300; color: #1A1A1A; margin-bottom: 16px;">Merci pour votre commande !</h2>

              <p style="color: #8A8580; font-weight: 300; line-height: 1.7;">
                Bonjour ${order.user.name},<br/><br/>
                Votre commande <strong>#${order.id.slice(-8).toUpperCase()}</strong> a bien été confirmée.
              </p>

              <div style="background: #F5F0EB; padding: 24px; margin: 24px 0; border-radius: 2px;">
                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #8A8580; margin-bottom: 16px;">Récapitulatif</h3>
                <table style="width: 100%; border-collapse: collapse;">
                ${order.items
                  .map(
                    (item) =>
                      `<tr>
                        <td style="color: #1A1A1A; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.06); text-align: left;">${item.product.name} &nbsp;x${item.quantity}</td>
                        <td style="color: #1A1A1A; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.06); text-align: right;">${(item.priceAtPurchase * item.quantity).toFixed(2)} €</td>
                      </tr>`
                  )
                  .join("")}
                  <tr>
                    <td style="padding: 16px 0 0; font-size: 18px; text-align: left;">
                      <strong style="color: #1A1A1A;">Total</strong>
                    </td>
                    <td style="padding: 16px 0 0; font-size: 18px; text-align: right;">
                      <strong style="color: #C4886B;">${order.totalAmount.toFixed(2)} €</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="color: #8A8580; font-weight: 300; font-size: 14px; text-align: center; margin-top: 32px;">
                © 2026 ALLURAE. Tous droits réservés.
              </p>
            </div>
          `,
        });

        console.log(`✅ Order ${orderId} processed: PAID, stock updated, email sent.`);
      } catch (error) {
        console.error("Error processing webhook:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
