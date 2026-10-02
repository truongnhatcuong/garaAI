import assert from "node:assert/strict";
import test from "node:test";
import { googleMapsDirectionsUrl, siteMapSchema } from "../src/lib/site-map";

test("nhận link nhúng Google Maps hoặc mã iframe do Google cung cấp", () => {
  const input = siteMapSchema.parse({
    placeName: " AutoCare AI ",
    address: " 123 Đường A, Đà Nẵng ",
    embedUrl: '<iframe src="https://www.google.com/maps/embed?pb=abc&amp;hl=vi" width="600"></iframe>',
  });
  assert.equal(input.placeName, "AutoCare AI");
  assert.equal(input.address, "123 Đường A, Đà Nẵng");
  assert.equal(input.embedUrl, "https://www.google.com/maps/embed?pb=abc&hl=vi");
});

test("từ chối link ngoài Google và cấu hình địa chỉ thiếu bản đồ", () => {
  assert.equal(siteMapSchema.safeParse({ placeName: "Gara", address: "Đà Nẵng", embedUrl: "https://example.com/maps/embed" }).success, false);
  assert.equal(siteMapSchema.safeParse({ placeName: "Gara", address: "Đà Nẵng", embedUrl: "" }).success, false);
  assert.equal(siteMapSchema.safeParse({ placeName: "Gara", address: "", embedUrl: "" }).success, true);
});

test("link chỉ đường giữ nguyên địa chỉ tiếng Việt", () => {
  const url = new URL(googleMapsDirectionsUrl("123 Đường A, Đà Nẵng"));
  assert.equal(url.hostname, "www.google.com");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), "123 Đường A, Đà Nẵng");
});
