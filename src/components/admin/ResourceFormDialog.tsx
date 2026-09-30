"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { LoaderCircle, X } from "lucide-react";
import {
  resourceConfig,
  type FieldConfig,
  type ResourceKey,
} from "@/lib/resource-config";
import {
  generatedCodeConfig,
  isGeneratedCodeField,
} from "@/lib/generated-code-config";
import { notifyError } from "@/lib/notify";
import { RelationPicker } from "@/components/admin/RelationPicker";
import { RepairBaySelect } from "@/components/admin/RepairBaySelect";

type Row = Record<string, unknown> & { id: string };
type Issue = { path: (string | number)[]; message: string };
function inputValue(value: unknown, type: FieldConfig["type"]) {
  if (value == null) return "";
  if (type === "date" || type === "datetime-local") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    ).toISOString();
    return type === "date" ? local.slice(0, 10) : local.slice(0, 16);
  }
  return String(value);
}
export function ResourceFormDialog({
  resource,
  mode,
  record,
  onClose,
  onSaved,
}: {
  resource: ResourceKey;
  mode: "create" | "edit";
  record?: Row | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const config = resourceConfig[resource];
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [employeePassword, setEmployeePassword] = useState("");
  const [originalBayCode, setOriginalBayCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  useEffect(() => {
    let active = true;
    async function load() {
      if (mode === "edit" && record) {
        try {
          const response = await fetch(`/api/${resource}/${record.id}`, {
            cache: "no-store",
          });
          const data = (await response.json()) as Row & { error?: string };
          if (!response.ok)
            throw new Error(data.error ?? "Không tải được dữ liệu.");
          if (active) {
            if (resource === "repair-orders") setOriginalBayCode(String(data.bayCode ?? ""));
            setValues(
              Object.fromEntries(
                config.fields.map((field) => [
                  field.name,
                  inputValue(data[field.name], field.type),
                ]),
              ),
            );
          }
        } catch (error) {
          if (active)
            setErrors({
              _form:
                error instanceof Error
                  ? error.message
                  : "Không tải được dữ liệu.",
            });
        } finally {
          if (active) setLoading(false);
        }
      } else
        setValues(
          Object.fromEntries(
            config.fields.map((field) => [
              field.name,
              field.options?.[0]?.value ?? "",
            ]),
          ),
        );
    }
    void load();
    return () => {
      active = false;
    };
  }, [resource, mode, record, config.fields]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingRelation = config.fields.find(
      (field) =>
        field.type === "relation" && field.required && !values[field.name],
    );
    if (missingRelation) {
      setErrors({
        [missingRelation.name]: `Vui lòng chọn ${missingRelation.label.toLowerCase()} trong danh sách.`,
      });
      return;
    }
    setSaving(true);
    setErrors({});
    const body: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (isGeneratedCodeField(resource, field.name)) continue;
      if (resource === "bays" && ["statusText", "progressNote", "reportedAt"].includes(field.name)) continue;
      const value = values[field.name]?.trim() ?? "";
      if (!value) {
        if (field.required) body[field.name] = "";
        else if (
          mode === "edit" &&
          ![
            "status",
            "method",
            "type",
            "issuedAt",
            "subtotal",
            "discount",
            "tax",
          ].includes(field.name)
        )
          body[field.name] = null;
        continue;
      }
      body[field.name] =
        field.type === "number"
          ? Number(value)
          : field.type === "datetime-local" || field.type === "date"
            ? new Date(value).toISOString()
            : value;
    }
    if (resource === "employees" && (mode === "create" || employeePassword)) body.password = employeePassword;
    try {
      const response = await fetch(
        mode === "create"
          ? `/api/${resource}`
          : `/api/${resource}/${record?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        details?: Issue[];
        code?: string;
        sku?: string;
      };
      if (!response.ok) {
        if (result.details)
          setErrors(
            Object.fromEntries(
              result.details.map((issue) => [
                String(issue.path[0] ?? "_form"),
                issue.message,
              ]),
            ),
          );
        throw new Error(result.error ?? "Không lưu được dữ liệu.");
      }
      const generated = generatedCodeConfig[resource];
      const code = generated ? result[generated.field] : undefined;
      onSaved(
        mode === "create"
          ? `Đã thêm ${config.singular}${code ? ` với mã ${code}` : ""}.`
          : `Đã cập nhật ${config.singular}.`,
      );
    } catch (error) {
      const message = notifyError(error, "Không lưu được dữ liệu.");
      setErrors((current) => ({ ...current, _form: message }));
    } finally {
      setSaving(false);
    }
  }
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="admin-theme fixed left-1/2 top-1/2 z-50 max-h-[min(90vh,850px)] w-[min(620px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border bg-white shadow-xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
            <Dialog.Title className="text-base font-semibold">
              {mode === "create" ? "Thêm" : "Sửa"} {config.singular}
            </Dialog.Title>
            <Dialog.Close aria-label="Đóng" className="rounded-md p-1">
              <X size={18} />
            </Dialog.Close>
          </div>
          {loading ? (
            <div className="p-6 text-sm">Đang tải dữ liệu…</div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {config.fields.map((field) =>
                  isGeneratedCodeField(resource, field.name) ? (
                    <label
                      key={field.name}
                      className="block text-xs font-medium"
                    >
                      {field.label}
                      <input
                        className="field mt-1.5 w-full bg-slate-50 text-slate-600"
                        readOnly
                        value={values[field.name] ?? ""}
                        placeholder="Tự động tạo khi lưu"
                      />
                      <span className="mt-1 block text-[11px] font-normal text-slate-500">
                        {mode === "create"
                          ? "Hệ thống sẽ tạo mã sau khi lưu."
                          : "Mã được giữ nguyên khi chỉnh sửa."}
                      </span>
                    </label>
                  ) : resource === "repair-orders" && field.name === "bayCode" ? (
                    <div key={field.name} className="text-xs font-medium">
                      <p>{field.label}</p>
                      <RepairBaySelect
                        value={values.bayCode ?? ""}
                        vehicleId={values.vehicleId ?? ""}
                        technicianId={values.technicianId ?? ""}
                        currentBayCode={originalBayCode}
                        onChange={(code) => setValues((current) => ({ ...current, bayCode: code }))}
                      />
                      <p className="mt-1 text-[11px] font-normal text-slate-500">Chọn khoang trống để bắt đầu sửa. Khi kỹ thuật viên báo hoàn thành, khoang sẽ tự trống.</p>
                      {errors.bayCode && <span role="alert" className="mt-1 block text-xs text-red-700">{errors.bayCode}</span>}
                    </div>
                  ) : field.type === "relation" ? (
                    <div key={field.name} className="text-xs font-medium">
                      <p>
                        {field.label}
                        {field.required && (
                          <span
                            className="ml-1 text-red-700"
                            aria-hidden="true"
                          >
                            *
                          </span>
                        )}
                      </p>
                      <div className="mt-1.5">
                        <RelationPicker
                          resource={field.relation!}
                          label={field.label}
                          value={values[field.name] ?? ""}
                          initialRecord={
                            record?.[field.name.slice(0, -2)] as Row | undefined
                          }
                          onChange={(id) => setValues((current) => ({
                            ...current,
                            [field.name]: id,
                            ...(resource === "repair-orders" && field.name === "vehicleId" && id !== current.vehicleId ? { bayCode: "" } : {}),
                          }))}
                        />
                      </div>
                      {errors[field.name] && (
                        <span
                          role="alert"
                          className="mt-1 block text-xs text-red-700"
                        >
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <label
                      key={field.name}
                      className={`block text-xs font-medium ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-700" aria-hidden="true">
                          *
                        </span>
                      )}
                      {field.type === "select" ? (
                        <select
                          className="field mt-1.5 w-full"
                          required={field.required}
                          value={values[field.name] ?? ""}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        >
                          {!field.required && <option value="">Chọn</option>}
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          className="field mt-1.5 min-h-20 w-full py-2"
                          readOnly={resource === "bays" && field.name === "progressNote"}
                          value={values[field.name] ?? ""}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      ) : (
                        <input
                          className="field mt-1.5 w-full"
                          type={field.name === "email" ? "email" : field.type}
                          readOnly={resource === "bays" && ["statusText", "reportedAt"].includes(field.name)}
                          required={field.required}
                          min={field.type === "number" ? 0 : undefined}
                          value={values[field.name] ?? ""}
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      )}
                      {errors[field.name] && (
                        <span
                          role="alert"
                          className="mt-1 block text-xs text-red-700"
                        >
                          {errors[field.name]}
                        </span>
                      )}
                    </label>
                  ),
                )}
                {resource === "employees" && (
                  <label className="block text-xs font-medium sm:col-span-2">
                    {mode === "create" ? "Mật khẩu ban đầu" : "Mật khẩu mới (để trống nếu không đổi)"}
                    {mode === "create" && <span className="ml-1 text-red-700" aria-hidden="true">*</span>}
                    <input className="field mt-1.5 w-full" type="password" required={mode === "create"} minLength={8} maxLength={128} autoComplete="new-password" value={employeePassword} onChange={(event) => setEmployeePassword(event.target.value)} />
                    <span className="mt-1 block text-[11px] font-normal text-slate-500">{mode === "create" ? "Ít nhất 8 ký tự. Chia sẻ thông tin đăng nhập cho nhân viên qua kênh riêng." : "Nếu nhân viên chưa có tài khoản, nhập mật khẩu để cấp tài khoản ngay."}</span>
                    {errors.password && <span role="alert" className="mt-1 block text-xs text-red-700">{errors.password}</span>}
                  </label>
                )}
              </div>
              {resource === "invoices" && (
                <p className="px-5 pb-2 text-xs text-[var(--admin-muted)]">
                  Ưu đãi hội viên và tổng thanh toán được tính tự động từ hạng
                  khách hàng khi lưu.
                </p>
              )}
              {resource === "bays" && <p className="px-5 pb-3 text-xs text-[var(--admin-muted)]">Chọn xe và kỹ thuật viên phụ trách. Nhân viên cập nhật tình trạng và báo cáo ở trang của họ; các ô báo cáo phía trên chỉ để xem. Khi đổi xe hoặc người phụ trách, báo cáo cũ được xóa và trạng thái quay về “Chờ thực hiện”.</p>}
              {errors._form && (
                <p role="alert" className="px-5 pb-2 text-sm text-red-700">
                  {errors._form}
                </p>
              )}
              <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-5 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-soft"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {saving && (
                    <LoaderCircle size={15} className="animate-spin" />
                  )}
                  {mode === "create" ? "Thêm" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
