import type { LucideIcon } from "lucide-react";
export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};
export type Service = {
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: LucideIcon;
};
export type Repair = {
  time: string;
  plate: string;
  vehicle: string;
  customer: string;
  advisor: string;
  technician: string;
  status: string;
  tone: "blue" | "amber" | "red" | "green";
};
export type InventoryItem = {
  sku: string;
  name: string;
  brand: string;
  location: string;
  cost: string;
  price: string;
  stock: string;
  critical?: boolean;
};
