import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Categories ────────────────────────────────
  const yoga = await prisma.category.upsert({
    where: { slug: "yoga" },
    update: {},
    create: { name: "Yoga", slug: "yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80" },
  });

  const summer = await prisma.category.upsert({
    where: { slug: "summer" },
    update: {},
    create: { name: "Summer", slug: "summer", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  });

  const lounge = await prisma.category.upsert({
    where: { slug: "lounge" },
    update: {},
    create: { name: "Lounge", slug: "lounge", image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80" },
  });

  const accessoire = await prisma.category.upsert({
    where: { slug: "accessoires" },
    update: {},
    create: { name: "Accessoires", slug: "accessoires", image: "/images/accessoire.jpg" },
  });

  // ─── Products ──────────────────────────────────
  const products = [
    // Yoga
    { name: "Legging Flow Ribbed", slug: "legging-flow-ribbed", price: 95, stock: 25, categoryId: yoga.id, colors: ["#2C2C2C", "#8B9E82", "#C4886B"], featured: true, description: "Legging taille haute en maille côtelée ultra-douce. Conçu pour le flow et le mouvement, il épouse chaque posture avec élégance." },
    { name: "Brassière Sunrise", slug: "brassiere-sunrise", price: 55, stock: 30, categoryId: yoga.id, colors: ["#F5F0EB", "#2C2C2C"], featured: true, description: "Brassière légère avec maintien moyen, parfaite pour le yoga et le pilates. Bretelles croisées dans le dos." },
    { name: "Ensemble Flow Set", slug: "ensemble-flow-set", price: 140, stock: 15, categoryId: yoga.id, colors: ["#2C2C2C", "#C4886B"], featured: false, description: "L'ensemble complet pour votre pratique : brassière + legging assortis en microfibre recyclée." },
    { name: "Legging Sculpt High-Rise", slug: "legging-sculpt-high-rise", price: 105, stock: 20, categoryId: yoga.id, colors: ["#2C2C2C", "#1a1a2e", "#8B9E82"], featured: false, description: "Notre legging sculptant signature. Taille ultra-haute, compression douce et poches latérales invisibles." },
    // Summer
    { name: "Short Solstice", slug: "short-solstice", price: 65, stock: 35, categoryId: summer.id, colors: ["#C4886B", "#7BA0B5", "#2C2C2C"], featured: true, description: "Short fluide en lin mélangé, taille élastique et poches italiennes. L'essentiel de l'été." },
    { name: "Débardeur Breath", slug: "debardeur-breath", price: 48, stock: 40, categoryId: summer.id, colors: ["#F5F0EB", "#8B9E82"], featured: false, description: "Débardeur ample en jersey respirant. Coupe oversize et encolure large pour un style décontracté." },
    { name: "Crop Top Riviera", slug: "crop-top-riviera", price: 52, stock: 28, categoryId: summer.id, colors: ["#F5F0EB", "#C4886B", "#7BA0B5"], featured: true, description: "Crop top noué avec imprimé méditerranéen. Tissu anti-UV léger et séchage rapide." },
    { name: "Robe Côtière", slug: "robe-cotiere", price: 88, stock: 18, categoryId: summer.id, colors: ["#E8E0D6", "#2C2C2C"], featured: false, description: "Robe midi évasée en coton organique. Du studio de yoga au coucher de soleil en terrasse." },
    // Lounge
    { name: "Hoodie Dusk Oversize", slug: "hoodie-dusk-oversize", price: 110, stock: 22, categoryId: lounge.id, colors: ["#E8E0D6", "#2C2C2C", "#8B9E82"], featured: true, description: "Hoodie oversize en molleton brossé. Capuche doublée et poche kangourou pour le confort ultime." },
    { name: "Jogger Cloud", slug: "jogger-cloud", price: 92, stock: 25, categoryId: lounge.id, colors: ["#E8E0D6", "#2C2C2C"], featured: false, description: "Jogger en coton peigné ultra-doux. Coupe décontractée, cheville resserrée et taille cordon." },
    // Accessoires
    { name: "Tapis de Yoga Grounding", slug: "tapis-yoga-grounding", price: 78, stock: 40, categoryId: accessoire.id, colors: ["#8B9E82", "#C4886B", "#2C2C2C"], featured: true, description: "Tapis de yoga 5mm en caoutchouc naturel. Surface antidérapante et marquage d'alignement subtil." },
    { name: "Sac Weekender Linen", slug: "sac-weekender-linen", price: 85, stock: 15, categoryId: accessoire.id, colors: ["#E8E0D6", "#2C2C2C"], featured: true, description: "Sac de weekend en lin lavé avec compartiment chaussures séparé. Bandoulière amovible." },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // ─── FAQs ────────────────────────────────────────
  const faqs = [
    {
      author: "Marie",
      email: "marie@example.com",
      question: "Quels sont les délais de livraison pour la France ?",
      answer: "Les commandes sont préparées sous 24h. La livraison en France Métropolitaine prend ensuite 2 à 3 jours ouvrables via Colissimo, ou 1 à 2 jours avec Chronopost Express.",
      isPublished: true,
    },
    {
      author: "Julie",
      email: "julie@example.com",
      question: "Comment entretenir vos pièces en lin ?",
      answer: "Nous vous recommandons un lavage doux à 30°C maximum (à l'envers). Évitez le sèche-linge ; privilégiez un séchage à l'air libre, à l'ombre. Le lin a tendance à s'assouplir à chaque lavage et gagne en douceur.",
      isPublished: true,
    },
    {
      author: "Sophie",
      email: "sophie@example.com",
      question: "Puis-je retourner ma commande si la taille ne me convient pas ?",
      answer: "Bien sûr, vous disposez de 14 jours après réception de votre commande pour effectuer un retour (les pièces ne doivent pas avoir été portées ni lavées). Les frais de retour sont à notre charge pour toute première commande.",
      isPublished: true,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqQuestion.create({
      data: faq,
    });
  }

  console.log("✅ Seed completed: categories, products, and FAQs created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
