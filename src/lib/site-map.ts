import { z } from "zod";

function extractEmbedUrl(value: string) {
  const match = value.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
  return (match?.[1] ?? value).replaceAll("&amp;", "&").trim();
}

const embedUrlSchema = z.string().trim().max(8000).transform(extractEmbedUrl).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && ["www.google.com", "google.com"].includes(url.hostname)
      && /^\/maps\/embed(?:\/|$)/.test(url.pathname);
  } catch {
    return false;
  }
}, "Chỉ dùng link nhúng HTTPS từ Google Maps.");

export const siteMapSchema = z.object({
  placeName: z.string().trim().min(2).max(100),
  address: z.string().trim().max(255),
  embedUrl: embedUrlSchema,
}).strict().refine((value) => Boolean(value.address) === Boolean(value.embedUrl), {
  message: "Nhập cả địa chỉ và link nhúng, hoặc để trống cả hai.",
  path: ["address"],
});

export type SiteMap = z.infer<typeof siteMapSchema>;

export function googleMapsDirectionsUrl(address: string) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", address);
  return url.toString();
}
