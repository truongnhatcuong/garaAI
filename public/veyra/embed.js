(() => {
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
