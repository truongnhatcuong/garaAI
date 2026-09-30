"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Popover } from "@base-ui/react/popover";
import {
  Bell,
  CalendarDays,
  CarFront,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  Menu,
  Package,
  ReceiptText,
  Search,
  Settings,
  Users,
  Wrench,
  X,
  BellRing,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/shared/Brand";
import { notifyError, notifySuccess } from "@/lib/notify";

const groups: {
  title: string;
  items: { label: string; href: string; icon: LucideIcon }[];
}[] = [
  {
    title: "Tổng quan",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Vận hành",
    items: [
      { label: "Lịch hẹn", href: "/admin/appointments", icon: CalendarDays },
      {
        label: "Phiếu sửa chữa",
        href: "/admin/repair-orders",
        icon: ClipboardList,
      },
      { label: "Phương tiện", href: "/admin/vehicles", icon: CarFront },
    ],
  },
  {
    title: "Quản lý",
    items: [
      { label: "Khách hàng", href: "/admin/customers", icon: Users },
      { label: "Dịch vụ", href: "/admin/services", icon: Wrench },
      { label: "Kho phụ tùng", href: "/admin/inventory", icon: Package },
      { label: "Khoang sửa chữa", href: "/admin/bays", icon: Warehouse },
      { label: "Nhân viên", href: "/admin/employees", icon: HardHat },
    ],
  },
  {
    title: "Tài chính",
    items: [
      {
        label: "Hóa đơn",
        href: "/admin/invoices",
        icon: ReceiptText,
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { label: "Báo cáo", href: "/admin/reports", icon: ChartNoAxesCombined },
      { label: "Thông báo", href: "/admin/notifications", icon: BellRing },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];
const links = groups.flatMap((group) => group.items);

export function AdminShell({
  children,
  name,
  email,
  phone,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
  phone: string | null;
}) {
  const initials = name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toUpperCase()).join("");
  const path = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [repairMatches, setRepairMatches] = useState<
    {
      id: string;
      code: string;
      vehicle?: { plate: string };
      customer?: { name: string };
    }[]
  >([]);
  const [customerMatches, setCustomerMatches] = useState<
    { id: string; name: string; phone?: string }[]
  >([]);
  const [vehicleMatches, setVehicleMatches] = useState<
    { id: string; plate: string; name: string }[]
  >([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [notifications, setNotifications] = useState<
    { id: string; title: string }[]
  >([]);
  useEffect(() => {
    let active = true;
    function loadNotifications() {
      if (document.visibilityState !== "visible") return;
      fetch("/api/notifications?pageSize=5", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("Không tải được thông báo.");
          return response.json() as Promise<{ items?: { id: string; title: string }[] }>;
        })
        .then((data) => { if (active) setNotifications(data.items ?? []); })
        .catch(() => {});
    }
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  useEffect(() => {
    const term = query.trim();
    if (!term) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const load = async (resource: string) => {
          const response = await fetch(
            `/api/${resource}?pageSize=5&search=${encodeURIComponent(term)}`,
            { signal: controller.signal, cache: "no-store" },
          );
          if (!response.ok) throw new Error("Không tải được kết quả tìm kiếm.");
          return response.json() as Promise<{ items: unknown[] }>;
        };
        const [repairs, customers, vehicles] = await Promise.all([
          load("repair-orders"),
          load("customers"),
          load("vehicles"),
        ]);
        if (controller.signal.aborted) return;
        setRepairMatches(repairs.items as typeof repairMatches);
        setCustomerMatches(customers.items as typeof customerMatches);
        setVehicleMatches(vehicles.items as typeof vehicleMatches);
      } catch (error) {
        if (!controller.signal.aborted)
          setSearchError(
            error instanceof Error ? error.message : "Không tìm được dữ liệu.",
          );
      } finally {
        if (!controller.signal.aborted) setSearchBusy(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  const current =
    links.find((item) => item.href === path) ??
    links.find(
      (item) => item.href !== "/admin" && path.startsWith(`${item.href}/`),
    );
  const term = query.trim().toLocaleLowerCase("vi");
  const pageMatches = term
    ? links.filter((item) => item.label.toLocaleLowerCase("vi").includes(term))
    : [];
  async function signOut() {
    setLogoutBusy(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok)
        throw new Error("Không thể đăng xuất. Vui lòng thử lại.");
      notifySuccess("Đã đăng xuất.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      notifyError(error, "Không thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setLogoutBusy(false);
    }
  }


  const sidebar = (
    <>
      <div className="admin-brand flex h-16 items-center border-b px-4">
        <Brand href="/admin" compact onClick={() => setDrawerOpen(false)} />
      </div>
      <nav
        aria-label="Điều hướng quản trị"
        className="flex-1 overflow-y-auto px-2 py-3"
      >
        {groups.map((group) => (
          <div className="mb-4" key={group.title}>
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[.08em] text-[var(--admin-muted)]">
              {group.title}
            </p>
            {group.items.map(({ label, href, icon: Icon }) => {
              const active =
                path === href ||
                (href !== "/admin" && path.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "admin-nav-link flex h-9 items-center gap-2.5 rounded-md px-3 text-[13px]",
                    active && "admin-nav-active",
                  )}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t px-5 py-3 text-[11px] text-[var(--admin-muted)]">
        AutoCare AI · Quản trị gara
      </div>
    </>
  );

  return (
    <div className="admin-theme min-h-screen lg:pl-[224px]">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-2"
      >
        Đến nội dung chính
      </a>
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-[224px] flex-col lg:flex">
        {sidebar}
      </aside>
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
          <Dialog.Popup className="admin-theme admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col">
            <Dialog.Title className="sr-only">Điều hướng quản trị</Dialog.Title>
            {sidebar}
            <Dialog.Close
              aria-label="Đóng điều hướng"
              className="absolute right-3 top-4 rounded-md p-1.5 lg:hidden"
            >
              <X size={18} />
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <header className="admin-header sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-white px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Mở điều hướng"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={19} />
        </Button>
        <nav
          aria-label="Breadcrumb"
          className="mr-auto flex min-w-0 items-center gap-2 text-xs text-[var(--admin-muted)]"
        >
          <Link href="/admin" className="hidden sm:inline">
            Quản trị
          </Link>
          <ChevronRight size={13} className="hidden sm:block" />
          <span
            className="truncate font-medium text-[var(--admin-ink)]"
            aria-current="page"
          >
            {current?.label ?? "Dashboard"}
            {path.split("/").length > 3 ? " / Chi tiết" : ""}
          </span>
        </nav>
        <Popover.Root open={searchOpen} onOpenChange={setSearchOpen}>
          <Popover.Trigger
            render={
              <Button variant="ghost" size="icon" aria-label="Tìm kiếm" />
            }
          >
            <Search size={18} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={10} className="z-50">
              <Popover.Popup className="admin-popover w-[min(380px,calc(100vw-24px))] p-2">
                <label htmlFor="admin-search" className="sr-only">
                  Tìm trang, biển số hoặc khách hàng
                </label>
                <input
                  id="admin-search"
                  autoFocus
                  className="field w-full text-sm"
                  placeholder="Tìm trang, biển số, khách hàng…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setRepairMatches([]);
                    setCustomerMatches([]);
                    setVehicleMatches([]);
                    setSearchError("");
                    setSearchBusy(!!event.target.value.trim());
                  }}
                />
                <div className="max-h-72 overflow-y-auto pt-1">
                  {!term && (
                    <p className="px-2 py-3 text-xs text-[var(--admin-muted)]">
                      Nhập tên trang, biển số hoặc khách hàng.
                    </p>
                  )}
                  {pageMatches.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="admin-search-result flex items-center gap-2 rounded-md px-2 py-2 text-sm"
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  ))}
                  {customerMatches.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/customers?search=${encodeURIComponent(query.trim())}`}
                      onClick={() => setSearchOpen(false)}
                      className="admin-search-result block rounded-md px-2 py-2 text-sm"
                    >
                      <strong>{item.name}</strong>
                      <span className="ml-2 text-xs text-[var(--admin-muted)]">
                        {item.phone}
                      </span>
                      <span className="block text-[11px] text-[var(--admin-muted)]">
                        Khách hàng
                      </span>
                    </Link>
                  ))}
                  {vehicleMatches.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/vehicles?search=${encodeURIComponent(query.trim())}`}
                      onClick={() => setSearchOpen(false)}
                      className="admin-search-result block rounded-md px-2 py-2 text-sm"
                    >
                      <strong>{item.plate}</strong>
                      <span className="ml-2 text-xs text-[var(--admin-muted)]">
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-[var(--admin-muted)]">
                        Phương tiện
                      </span>
                    </Link>
                  ))}
                  {repairMatches.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/repair-orders/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="admin-search-result block rounded-md px-2 py-2 text-sm"
                    >
                      <strong>{item.code}</strong>
                      <span className="ml-2 text-xs text-[var(--admin-muted)]">
                        {item.vehicle?.plate} · {item.customer?.name}
                      </span>
                      <span className="block text-[11px] text-[var(--admin-muted)]">
                        Phiếu sửa chữa
                      </span>
                    </Link>
                  ))}
                  {term && searchBusy && (
                    <p
                      role="status"
                      className="px-2 py-3 text-xs text-[var(--admin-muted)]"
                    >
                      Đang tìm…
                    </p>
                  )}
                  {term && searchError && (
                    <p role="alert" className="px-2 py-3 text-xs text-red-700">
                      {searchError}
                    </p>
                  )}
                  {term &&
                    !searchBusy &&
                    !searchError &&
                    !pageMatches.length &&
                    !customerMatches.length &&
                    !vehicleMatches.length &&
                    !repairMatches.length && (
                      <p className="px-2 py-3 text-xs text-[var(--admin-muted)]">
                        Không tìm thấy kết quả.
                      </p>
                    )}
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger
            render={
              <Button variant="ghost" size="icon" aria-label="Thông báo" />
            }
          >
            <Bell size={18} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={10} className="z-50">
              <Popover.Popup className="admin-popover w-[min(320px,calc(100vw-24px))] p-4">
                <h2 className="text-sm font-semibold">Thông báo</h2>
                <div className="mt-3 border-t pt-2">
                  {notifications.length ? (
                    notifications.map((item) => (
                      <p key={item.id} className="py-1 text-sm">
                        {item.title}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--admin-muted)]">
                      Chưa có thông báo.
                    </p>
                  )}
                </div>
                <Link
                  href="/admin/notifications"
                  className="admin-text-link mt-2 block text-xs"
                >
                  Xem tất cả <ChevronRight size={12} className="inline" />
                </Link>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <span className="mx-1 hidden h-5 w-px bg-[var(--admin-line)] sm:block" />
        <Popover.Root>
          <Popover.Trigger
            className="flex items-center gap-2 rounded-md p-1 text-left"
            aria-label="Hồ sơ tài khoản"
          >
            <span className="admin-avatar grid size-7 place-items-center rounded-full text-[11px] font-semibold">
              {initials}
            </span>
            <span className="hidden max-w-36 truncate text-xs font-medium sm:block">{name}</span>
            <ChevronDown
              size={13}
              className="hidden text-[var(--admin-muted)] sm:block"
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={10} className="z-50">
              <Popover.Popup className="admin-popover w-64 p-3">
                <p className="text-sm font-semibold">{name}</p>
                <p className="mt-0.5 text-xs text-[var(--admin-muted)]">
                  Quản trị viên
                </p>
                <div className="mt-3 space-y-1 border-t pt-3 text-xs text-[var(--admin-muted)]">
                  <p className="break-all">{email}</p>
                  <p>{phone || "Chưa cập nhật số điện thoại"}</p>
                </div>
                <Link href="/admin/settings#profile" className="mt-3 block border-t pt-3 text-sm">Thông tin tài khoản</Link>
                <Link
                  href="/admin/settings#change-password"
                  className="mt-3 block text-sm"
                >
                  Đổi mật khẩu
                </Link>
                <button
                  disabled={logoutBusy}
                  className="mt-3 text-sm text-red-700 disabled:opacity-50"
                  onClick={() => void signOut()}
                >
                  {logoutBusy ? "Đang đăng xuất…" : "Đăng xuất"}
                </button>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <main
        id="admin-content"
        tabIndex={-1}
        className="min-w-0 px-4 py-5 outline-none sm:px-6 lg:px-7"
      >
        {children}
      </main>
    </div>
  );
}
