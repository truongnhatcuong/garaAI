"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DashboardChartPoint = {
  label: string;
  rangeLabel: string;
  revenue: number;
  appointmentCount: number;
  orderCount: number;
};

const currency = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });

function ChartPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel min-w-0 overflow-hidden">
      <div className="border-b px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-[var(--admin-muted)]">{description}</p>
      </div>
      <div className="h-[290px] min-w-0 px-2 pb-4 pt-6 sm:px-4">{children}</div>
    </section>
  );
}

export function DashboardCharts({ points }: { points: DashboardChartPoint[] }) {
  const chartMargin = { top: 8, right: 14, bottom: 0, left: -12 };
  const hasRevenue = points.some((point) => point.revenue > 0);
  const hasWorkload = points.some((point) => point.appointmentCount > 0 || point.orderCount > 0);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartPanel title="Doanh thu theo thời gian" description="Tổng tiền từ các thanh toán hoàn tất, theo ngày thanh toán">
        {hasRevenue ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={points} margin={chartMargin} accessibilityLayer>
            <defs>
              <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#17777b" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#17777b" stopOpacity={0.015} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e8edf0" strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickMargin={10} minTickGap={12} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value: number) => compact.format(value)} width={54} allowDecimals={false} />
            <Tooltip
              labelFormatter={(_label, payload) => payload[0]?.payload?.rangeLabel ?? ""}
              formatter={(value) => [`${currency.format(Number(value))} ₫`, "Doanh thu"]}
            />
            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#17777b" strokeWidth={2.5} fill="url(#dashboardRevenueFill)" dot={{ r: 3, fill: "#17777b", strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-[var(--admin-muted)]">Chưa có thanh toán trong kỳ này.</div>}
      </ChartPanel>

      <ChartPanel title="Lịch hẹn & phiếu sửa chữa" description="Lịch hẹn theo ngày hẹn; phiếu sửa chữa theo ngày tạo">
        {hasWorkload ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={points} margin={chartMargin} accessibilityLayer barGap={3}>
            <CartesianGrid vertical={false} stroke="#e8edf0" strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickMargin={10} minTickGap={12} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} width={35} allowDecimals={false} />
            <Tooltip
              labelFormatter={(_label, payload) => payload[0]?.payload?.rangeLabel ?? ""}
            />
            <Legend verticalAlign="top" align="right" height={30} iconType="circle" />
            <Bar dataKey="appointmentCount" name="Lịch hẹn" fill="#268d9b" radius={[3, 3, 0, 0]} maxBarSize={22} />
            <Bar dataKey="orderCount" name="Phiếu sửa chữa" fill="#e0a45e" radius={[3, 3, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer> : <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[var(--admin-muted)]">Chưa có lịch hẹn hoặc phiếu sửa chữa trong kỳ này.</div>}
      </ChartPanel>
    </div>
  );
}
