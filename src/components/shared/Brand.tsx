import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
export function Brand({
  compact = false,
  large = false,
  inverse = false,
  href = "/",
  className,
  onClick,
}: {
  compact?: boolean;
  large?: boolean;
  inverse?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const imageSize = compact ? 44 : large ? 76 : 56;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("inline-flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500", className)}
      aria-label={href === "/admin" ? "Gara Sửa Xe - Trang quản trị" : "Gara Sửa Xe - Trang chủ"}
    >
      <Image
        src="/images/image.png"
        alt="Logo Gara Sửa Xe"
        width={imageSize}
        height={imageSize}
        priority
        className={cn("shrink-0 rounded-md bg-white object-contain", compact ? "h-11 w-11" : large ? "h-[76px] w-[76px]" : "h-14 w-14")}
      />
      <span className="min-w-0 leading-tight">
        <strong className={cn("block whitespace-nowrap font-[family-name:var(--font-jakarta)] text-[15px] font-extrabold tracking-tight", inverse ? "text-white" : "text-[#0b1930]", compact && "text-[13px]", large && "text-lg")}>Gara Sửa Xe</strong>
        <span className={cn("mt-0.5 block whitespace-nowrap text-[10px] font-semibold tracking-wide", inverse ? "text-blue-200" : "text-blue-700")}>AUTOCARE AI</span>
      </span>
    </Link>
  );
}
