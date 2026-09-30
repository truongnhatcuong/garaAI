import { Prisma } from "@/generated/prisma/client";

export function calculateInvoiceAmounts(subtotal: Prisma.Decimal, discountPercent: Prisma.Decimal | number, taxPercent: Prisma.Decimal | number) {
  const discount = subtotal.mul(discountPercent).div(100).toDecimalPlaces(2);
  const taxable = subtotal.sub(discount);
  const tax = taxable.mul(taxPercent).div(100).toDecimalPlaces(2);
  return { discount, tax, total: taxable.add(tax) };
}
