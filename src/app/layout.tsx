import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jakarta",
});
export const metadata: Metadata = {
  title: "Gara Ôtô | AutoCare AI",
  description: "Nền tảng quản lý gara và chăm sóc xe thông minh",
  icons: {
    icon: "/images/image.png",
    apple: "/images/image.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable}`}>
        {children}
        <Toaster position="top-right" richColors closeButton visibleToasts={4} />
      </body>
    </html>
  );
}
