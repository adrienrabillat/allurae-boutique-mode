export type { Product, Category, Order, OrderItem, User } from "@prisma/client";

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  imageUrl: string | null;
  colors: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface OrderWithItems {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  stripeSessionId: string | null;
  shippingName: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
  shippingPhone: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string; email: string };
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: { name: string; slug: string; imageUrl: string | null };
  }[];
}
