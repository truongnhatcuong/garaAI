"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Popover } from "@base-ui/react/popover";
import {
  CalendarDays,
  CarFront,
  ChevronDown,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "@/components/shared/Brand";
import { CustomerFooter } from "@/components/customer/CustomerFooter";
import { cn } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notify";
const links = [
  ["Trang chủ", "/"],
  ["Dịch vụ", "/services"],
  ["Đặt lịch", "/appointments"],
  ["Xe của tôi", "/vehicles"],
  ["Theo dõi sửa chữa", "/repairs"],
  ["Báo giá & Hóa đơn", "/invoices"],
  ["Trợ lý AI", "/ai-assistant"],
];
export function CustomerShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [account, setAccount] = useState<{
    role: "ADMIN" | "CUSTOMER";
    customer?: { name: string };
  } | null>(null);
  const profileHref = account?.role === "ADMIN" ? "/admin" : "/profile";
  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then(setAccount)
      .catch(() => {});
  }, []);
  async function signOut() {
    setLogoutBusy(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok)
        throw new Error("Không thể đăng xuất. Vui lòng thử lại.");
      setAccount(null);
      setAccountOpen(false);
      setOpen(false);
      notifySuccess("Đã đăng xuất.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        notifyError(error, "Không thể đăng xuất. Vui lòng thử lại."),
      );
    } finally {
      setLogoutBusy(false);
    }
  }
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-8 px-4 md:px-6">
          <Brand />
          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-[13px] font-medium",
                  path === href
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {account ? (
              <Popover.Root open={accountOpen} onOpenChange={setAccountOpen}>
                <Popover.Trigger
                  aria-label="Mở menu tài khoản"
                  className="flex min-h-10 items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  aria-expanded={accountOpen}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-700 text-white">
                    <UserRound size={18} />
                  </span>
                  <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-800 lg:block">
                    {account.customer?.name ?? "Quản trị"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-slate-500 transition-transform",
                      accountOpen && "rotate-180",
                    )}
                  />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner
                    align="end"
                    sideOffset={10}
                    className="z-50"
                  >
                    <Popover.Popup className="w-[min(280px,calc(100vw-24px))] rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 outline-none">
                      <div className="border-b border-slate-100 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {account.customer?.name ?? "Quản trị viên"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {account.role === "ADMIN"
                            ? "Tài khoản quản trị"
                            : "Tài khoản khách hàng"}
                        </p>
                      </div>
                      <nav aria-label="Tài khoản" className="py-1">
                        <Link
                          href={profileHref}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <UserRound size={16} />
                          {account.role === "ADMIN"
                            ? "Trang quản trị"
                            : "Hồ sơ cá nhân"}
                        </Link>
                        {account.role === "CUSTOMER" && (
                          <>
                            <Link
                              href="/vehicles"
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <CarFront size={16} />
                              Xe của tôi
                            </Link>
                            <Link
                              href="/appointments"
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <CalendarDays size={16} />
                              Lịch hẹn của tôi
                            </Link>
                            <Link
                              href="/profile#change-password"
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <UserRound size={16} />
                              Đổi mật khẩu
                            </Link>
                          </>
                        )}
                      </nav>
                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          disabled={logoutBusy}
                          onClick={() => void signOut()}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <LogOut size={16} />
                          {logoutBusy ? "Đang đăng xuất…" : "Đăng xuất"}
                        </button>
                        {logoutError && (
                          <p
                            role="alert"
                            className="px-3 pb-1 text-xs text-red-700"
                          >
                            {logoutError}
                          </p>
                        )}
                      </div>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            ) : (
              <Link href="/login" className="text-sm font-medium text-blue-700">
                Đăng nhập
              </Link>
            )}
            <button
              className="rounded-lg p-2 xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Mở menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t p-3 xl:hidden">
            {links.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-blue-50"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
