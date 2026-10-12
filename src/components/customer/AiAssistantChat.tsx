"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowUpRight,
  CalendarDays,
  LoaderCircle,
  RotateCcw,
  Send,
  Sparkles,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import { customerAssistantOpenEvent } from "@/lib/customer-assistant-navigation";
import { notifyError } from "@/lib/notify";

type Message = { role: "user" | "assistant"; content: string };
const suggestions = [
  "Gara có dịch vụ bảo dưỡng nào?",
  "Xe của tôi đang sửa đến đâu?",
  "Hóa đơn gần nhất của tôi đã thanh toán chưa?",
  "Xe kêu khi phanh, tôi nên làm gì?",
];
const assistantLinks = new Set([
  "/appointments",
  "/invoices",
  "/repairs",
  "/vehicles",
]);

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="min-w-0 max-w-[calc(100%_-_3.25rem)] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm sm:max-w-[85%] sm:px-5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 break-words last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 marker:text-blue-600 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-blue-700 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="break-words pl-0.5">{children}</li>
          ),
          a: ({ href, children }) =>
            href && assistantLinks.has(href) ? (
              <Link
                href={href}
                className="mr-2 inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-800 no-underline transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {children}
                <ArrowUpRight aria-hidden="true" size={13} />
              </Link>
            ) : (
              <span>{children}</span>
            ),
          img: () => null,
          blockquote: ({ children }) => (
            <aside
              role="alert"
              className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-amber-950 first:mt-0 last:mb-0"
            >
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-amber-700"
                size={18}
              />
              <div className="min-w-0 flex-1 [&>p]:mb-0">{children}</div>
            </aside>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-900">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="mb-3 max-w-full overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-slate-200 bg-slate-50 px-2 py-1.5 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-2 py-1.5 align-top">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-slate-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function AssistantAvatar({ large = false }: { large?: boolean }) {
  return (
    <span
      className={
        large
          ? "relative block h-10 w-10 shrink-0"
          : "relative block h-10 w-10 shrink-0"
      }
    >
      <Image
        src="/images/aiGara.png"
        alt="AI Assistant"
        fill
        sizes={large ? "40px" : "40px"}
        className="object-contain"
      />
    </span>
  );
}

export function AiAssistantChat({
  customerName,
}: {
  customerName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    const openFromHash = () => {
      if (window.location.hash === "#chat") openAssistant();
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    window.addEventListener(customerAssistantOpenEvent, openAssistant);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      window.removeEventListener(customerAssistantOpenEvent, openAssistant);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      const scroll = scrollRef.current;
      scroll?.scrollTo({
        top: scroll.scrollHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, busy, open, error]);

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen && window.location.hash === "#chat") {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  async function send(content: string) {
    const question = content.trim();
    if (!question || sendingRef.current || !customerName) return;
    sendingRef.current = true;
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = (await response.json()) as {
        reply?: string;
        error?: string;
      };
      if (!response.ok || !result.reply)
        throw new Error(result.error ?? "Trợ lý AI chưa phản hồi được.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply! },
      ]);
    } catch (failure) {
      setMessages((current) => current.slice(0, -1));
      setDraft(question);
      setError(
        notifyError(failure, "Không gửi được câu hỏi. Vui lòng thử lại."),
      );
    } finally {
      sendingRef.current = false;
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void send(draft);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={changeOpen}
      modal={false}
      disablePointerDismissal
      triggerId="customer-ai-trigger"
    >
      <Dialog.Trigger
        ref={triggerRef}
        id="customer-ai-trigger"
        aria-label={open ? "Đóng trợ lý AutoCare AI" : "Mở trợ lý AutoCare AI"}
        className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex min-h-14 items-center gap-2.5 rounded-full border border-white/20 bg-[var(--primary)] py-2 pr-3 pl-2.5 text-white shadow-xl shadow-blue-950/20 hover:bg-[var(--primary-2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 sm:right-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        {open ? (
          <span className="grid h-10 w-10 place-items-center">
            <X aria-hidden="true" size={22} />
          </span>
        ) : (
          <AssistantAvatar />
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          initialFocus={closeRef}
          finalFocus={triggerRef}
          className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] z-50 flex h-[min(640px,calc(100dvh_-_7rem_-_env(safe-area-inset-bottom)))] w-[min(420px,calc(100vw_-_2rem_-_env(safe-area-inset-right)))] flex-col overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-2xl shadow-blue-950/20 outline-none isolate sm:right-6 sm:bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+4.5rem)]"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AssistantAvatar />
              <div>
                <Dialog.Title className="heading text-sm font-bold text-[var(--primary)]">
                  Trợ lý AutoCare AI
                </Dialog.Title>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted)]">
                  <Sparkles aria-hidden="true" size={12} /> Đồng hành chăm sóc
                  xe
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  aria-label="Cuộc trò chuyện mới"
                  title="Cuộc trò chuyện mới"
                  className="grid h-11 w-11 place-items-center rounded-xl text-[var(--muted)] hover:bg-white focus-visible:outline-2 focus-visible:outline-blue-700 disabled:opacity-50"
                  onClick={() => {
                    setMessages([]);
                    setError("");
                  }}
                  disabled={busy}
                >
                  <RotateCcw aria-hidden="true" size={17} />
                </button>
              )}
              <Dialog.Close
                ref={closeRef}
                aria-label="Đóng cửa sổ trò chuyện"
                className="grid h-11 w-11 place-items-center rounded-xl text-[var(--muted)] hover:bg-white focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                <X aria-hidden="true" size={20} />
              </Dialog.Close>
            </div>
          </div>
          <Dialog.Description className="sr-only">
            Hỏi về dịch vụ, lịch hẹn, tiến độ sửa chữa và hóa đơn của bạn.
          </Dialog.Description>
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-slate-50/70 px-3 py-4 sm:px-4"
            role="log"
            aria-label="Lịch sử trò chuyện"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && !busy && (
              <div className="flex justify-center">
                <Image
                  src="/images/aiGara.png"
                  alt="Robot AutoCare AI chào đón bạn"
                  width={180}
                  height={148}
                  sizes="112px"
                  className="h-auto w-28 object-contain"
                />
              </div>
            )}
            <div className="flex items-start gap-3">
              <AssistantAvatar />
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">
                {customerName
                  ? "Chào " +
                    customerName +
                    "! Mình có thể giúp bạn xem dịch vụ, lịch hẹn, tiến độ sửa chữa và hóa đơn của bạn."
                  : "Chào bạn! Hãy đăng nhập tài khoản khách hàng để mình có thể tư vấn theo hồ sơ xe của bạn."}
              </div>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  "flex items-start gap-3 " +
                  (message.role === "user" ? "justify-end" : "")
                }
              >
                {message.role === "assistant" && <AssistantAvatar />}
                {message.role === "assistant" ? (
                  <AssistantMessage content={message.content} />
                ) : (
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-blue-700 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                    {message.content}
                  </div>
                )}
                {message.role === "user" && (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600">
                    <UserRound size={16} />
                  </span>
                )}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-3" role="status">
                <AssistantAvatar />
                <p className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
                  <LoaderCircle
                    aria-hidden="true"
                    size={16}
                    className="shrink-0 animate-spin motion-reduce:animate-none"
                  />{" "}
                  Đang tìm thông tin và soạn câu trả lời…
                </p>
              </div>
            )}
            {customerName && messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pl-[52px]">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={busy}
                    onClick={() => void send(suggestion)}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs leading-5 text-blue-800 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-700 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                {error}
              </p>
            )}
          </div>
          <div className="shrink-0 border-t border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
            {customerName ? (
              <form onSubmit={submit} className="flex items-end gap-2">
                <label className="sr-only" htmlFor="customer-ai-question">
                  Câu hỏi của bạn
                </label>
                <textarea
                  id="customer-ai-question"
                  className="field min-h-12 max-h-24 min-w-0 flex-1 resize-y py-3 text-base sm:text-sm"
                  rows={1}
                  maxLength={2000}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Nhập câu hỏi của bạn…"
                  disabled={busy}
                />
                <button
                  type="submit"
                  aria-label="Gửi câu hỏi"
                  className="btn btn-primary min-h-12 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={busy || !draft.trim()}
                >
                  <Send aria-hidden="true" size={18} />
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn btn-primary w-full">
                Đăng nhập để trò chuyện
              </Link>
            )}
            <div className="mt-2.5 flex items-center justify-between gap-3 text-[11px] text-[var(--muted)]">
              <span>Hỗ trợ từ hồ sơ và danh mục gara</span>
              <Link
                href="/appointments"
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
              >
                <CalendarDays aria-hidden="true" size={13} /> Đặt lịch
              </Link>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-[var(--muted)]">
              Tư vấn AI chỉ mang tính tham khảo; kỹ thuật viên sẽ xác nhận tình
              trạng xe sau khi kiểm tra thực tế.
            </p>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
