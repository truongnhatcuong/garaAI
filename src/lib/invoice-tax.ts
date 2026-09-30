import { z } from "zod";

export const invoiceTaxSchema = z.object({
  taxPercent: z.number().finite().min(0).max(100).multipleOf(0.01),
}).strict();
