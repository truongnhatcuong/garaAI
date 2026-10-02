import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const release = path.join(root, "veyra-interactive-car");
const adaptation = path.join(root, "veyra-autocare");
const destination = path.join(root, "public/veyra");
const manifest = JSON.parse(await readFile(path.join(release, "reference-manifest.json"), "utf8"));

if (manifest.release !== "v1.0.0") throw new Error("Expected the approved VEYRA v1.0.0 release.");
for (const entry of manifest.files) {
  let bytes = await readFile(path.join(release, entry.path));
  if (entry.text) bytes = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
  if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256) {
    throw new Error(`Approved reference differs: ${entry.path}`);
  }
}

// The user's Vietnamese/theme adaptation may change only these presentation files.
const presentationFiles = new Set(["index.html", "src/App.tsx", "src/AppearanceMenu.tsx", "src/appearance.ts", "src/content.ts", "src/index.css"]);
for (const entry of manifest.files.filter((file) => !presentationFiles.has(file.path))) {
  let bytes = await readFile(path.join(adaptation, entry.path));
  if (entry.text) bytes = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
  if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256) {
    throw new Error(`Adaptation changed protected reference: ${entry.path}`);
  }
}
// Delivery plumbing remains separate from translated source and approved media.
const html = (await readFile(path.join(adaptation, "dist/index.html"), "utf8"))
  .replaceAll('"/assets/', '"./assets/')
  .replace("</head>", '<link rel="stylesheet" href="./embed.css" /></head>')
  .replace("</body>", '<script src="./embed.js" defer></script></body>');
await mkdir(destination, { recursive: true });
await rm(path.join(destination, "assets"), { recursive: true, force: true });
await cp(path.join(adaptation, "dist/assets"), path.join(destination, "assets"), { recursive: true });
await cp(path.join(release, "public/media"), path.join(root, "public/media"), { recursive: true });
for (const file of ["LICENSE", "THIRD_PARTY_NOTICES.md", "reference-manifest.json"]) {
  await cp(path.join(release, file), path.join(destination, file));
}
await writeFile(path.join(destination, "index.html"), html);

// Only the embedded stacked layout loses its viewport-height floor. Media coordinates stay intact.
await writeFile(path.join(destination, "embed.css"), `@media (max-width: 900px) {
  html.veyra-embedded .experience { min-height: 0; }
  html.veyra-embedded .scene-footer { flex: none; }
}
`);
await writeFile(path.join(destination, "embed.js"), `(() => {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest(".wordmark")) return;
    event.preventDefault();
    window.location.reload();
  });
  if (window.parent === window) return;
  document.documentElement.classList.add("veyra-embedded");
  let frame = 0;
  const report = () => {
    frame = 0;
    const scene = document.querySelector(".experience");
    if (!scene || window.innerWidth > 900) return;
    window.parent.postMessage({
      type: "veyra:height",
      height: Math.ceil(scene.getBoundingClientRect().height),
    }, window.location.origin);
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(report);
  };
  const observer = new ResizeObserver(schedule);
  const connect = () => {
    const scene = document.querySelector(".experience");
    if (!scene) return;
    observer.observe(scene);
    schedule();
  };
  const mountObserver = new MutationObserver(() => {
    if (!document.querySelector(".experience")) return;
    mountObserver.disconnect();
    connect();
  });
  if (document.querySelector(".experience")) connect();
  else mountObserver.observe(document.getElementById("root"), { childList: true });
  window.addEventListener("message", (event) => {
    if (event.origin === window.location.origin && event.source === window.parent
      && event.data?.type === "veyra:measure") schedule();
  });
  window.addEventListener("resize", schedule, { passive: true });
})();
`);

for (const entry of manifest.files.filter((file) => file.path.startsWith("public/media/"))) {
  const bytes = await readFile(path.join(root, entry.path));
  if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256) {
    throw new Error(`Copied media differs: ${entry.path}`);
  }
}
console.log("VEYRA v1.0.0 synced: Vietnamese/AutoCare presentation; protected playback and all 18 media hashes unchanged.");
