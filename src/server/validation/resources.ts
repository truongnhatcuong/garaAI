import "server-only";
import { z } from "zod";
import { resourceConfig, type FieldConfig, type ResourceKey } from "@/lib/resource-config";
import { isGeneratedCodeField } from "@/lib/generated-code-config";

const blankToUndefined = (value: unknown) => value === "" || value === null ? undefined : value;
const nonNullableOptional = new Set(["status", "method", "type", "issuedAt", "subtotal", "discount", "tax"]);
function fieldSchema(field: FieldConfig): z.ZodType {
  let schema: z.ZodType;
  if (field.type === "number") {
    const numberSchema = ["stockQty", "minStock", "durationMinutes", "odometerKm"].includes(field.name)
      ? z.coerce.number().int().min(0)
      : z.coerce.number().finite().min(0, `${field.label} phải lớn hơn hoặc bằng 0`);
    schema = z.preprocess((value) => value === "" ? undefined : value, numberSchema);
  } else if (field.type === "date" || field.type === "datetime-local") {
    schema = z.coerce.date();
  } else if (field.type === "select") {
    schema = z.string().refine((value) => field.options?.some((option) => option.value === value), `Giá trị ${field.label} không hợp lệ`);
  } else {
    schema = z.string().trim().min(1, `${field.label} không được để trống`).max(field.type === "textarea" ? 5000 : 255);
    if (field.name === "email") schema = z.email();
    if (field.name === "phone") schema = z.string().regex(/^[+\d\s().-]{9,20}$/, "Số điện thoại không hợp lệ");
  }
  return field.required ? schema : nonNullableOptional.has(field.name) ? z.preprocess(blankToUndefined, schema.optional()) : z.preprocess((value) => value === "" ? null : value, schema.nullable().optional());
}

export function resourceInputSchema(resource: ResourceKey, partial = false) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of resourceConfig[resource].fields) {
    if (isGeneratedCodeField(resource, field.name)) continue;
    shape[field.name] = partial ? fieldSchema(field).optional() : fieldSchema(field);
  }
  return z.object(shape).strict();
}

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).default(""),
  status: z.string().optional(),
  sort: z.string().optional(),
  direction: z.enum(["asc", "desc"]).default("desc"),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  stock: z.enum(["all", "low"]).optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;
export function parseListQuery(params: URLSearchParams): ListQuery {
  return listQuerySchema.parse(Object.fromEntries(params));
}
