import assert from "node:assert/strict";
import { test } from "node:test";
import { Prisma } from "../src/generated/prisma/client";
import { calculateInvoiceAmounts } from "../src/server/services/invoice-amounts";
import { invoiceTaxSchema } from "../src/lib/invoice-tax";

test("tax is applied after membership discount and added to the payable total", () => {
  const amounts = calculateInvoiceAmounts(new Prisma.Decimal(1000000), 10, 8);
  assert.equal(amounts.discount.toString(), "100000");
  assert.equal(amounts.tax.toString(), "72000");
  assert.equal(amounts.total.toString(), "972000");
});

test("zero tax and full discount preserve the expected totals", () => {
  assert.equal(calculateInvoiceAmounts(new Prisma.Decimal(1000000), 10, 0).total.toString(), "900000");
  const free = calculateInvoiceAmounts(new Prisma.Decimal(1000000), 100, 10);
  assert.equal(free.tax.toString(), "0");
  assert.equal(free.total.toString(), "0");
});

test("fractional percentages use decimal arithmetic and round amounts to two places", () => {
  const amounts = calculateInvoiceAmounts(new Prisma.Decimal("123.45"), 10, 8.25);
  assert.equal(amounts.discount.toString(), "12.35");
  assert.equal(amounts.tax.toString(), "9.17");
  assert.equal(amounts.total.toString(), "120.27");
});

test("tax settings accept only numeric percentages from 0 to 100 with two decimal places", () => {
  for (const taxPercent of [0, 8, 8.25, 10, 100]) assert.equal(invoiceTaxSchema.safeParse({ taxPercent }).success, true);
  for (const taxPercent of [-1, 101, 8.255, NaN, Infinity, "8", null]) assert.equal(invoiceTaxSchema.safeParse({ taxPercent }).success, false);
  assert.equal(invoiceTaxSchema.safeParse({}).success, false);
});
