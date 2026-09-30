"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="admin-panel mx-auto mt-8 max-w-lg p-6" role="alert"><h1 className="admin-page-title">Không thể tải trang</h1><p className="mt-2 text-sm text-[var(--admin-muted)]">Có lỗi khi hiển thị nội dung. Hãy thử tải lại.</p><div className="mt-5 flex gap-2"><Button onClick={retry} className="btn btn-primary">Thử lại</Button><Link href="/admin" className="btn btn-soft">Về tổng quan</Link></div></div>;
}
