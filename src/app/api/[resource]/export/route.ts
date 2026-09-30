import ExcelJS from "exceljs";
import { displayValue, fieldValue, isResourceKey, resourceConfig } from "@/lib/resource-config";
import { apiError, listForExport } from "@/server/services/resource-service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, context: Context) {
  const { resource } = await context.params;
  if (!isResourceKey(resource) || !resourceConfig[resource].exportable) return Response.json({ error: "Bảng này không hỗ trợ xuất Excel." }, { status: 404 });
  try {
    const rows = await listForExport(resource, new URL(request.url).searchParams);
    const config = resourceConfig[resource];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(config.title.slice(0, 31));
    sheet.columns = config.columns.map((column) => ({ header: column.label, key: column.key, width: Math.max(16, column.label.length + 8) }));
    for (const row of rows) {
      const values: Record<string, string> = {};
      for (const column of config.columns) values[column.key] = displayValue(fieldValue(row, column.key), column.key, config);
      sheet.addRow(values);
    }
    sheet.getRow(1).font = { bold: true };
    sheet.autoFilter = { from: "A1", to: `${String.fromCharCode(64 + config.columns.length)}${Math.max(1, rows.length + 1)}` };
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="autocare-${resource}.xlsx"`, "Cache-Control": "no-store" } });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
