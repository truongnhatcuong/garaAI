"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUpRight, CalendarDays, RotateCcw, Send, Sparkles, TriangleAlert, UserRound } from "lucide-react";
import { notifyError } from "@/lib/notify";

type Message = { role: "user" | "assistant"; content: string };
const suggestions = ["Gara có dịch vụ bảo dưỡng nào?", "Xe của tôi đang sửa đến đâu?", "Hóa đơn gần nhất của tôi đã thanh toán chưa?", "Xe kêu khi phanh, tôi nên làm gì?"];
const assistantLinks = new Set(["/appointments", "/invoices", "/repairs", "/vehicles"]);

function AssistantMessage({ content }: { content: string }) {
  return <div className="min-w-0 max-w-[calc(100%_-_3.25rem)] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm sm:max-w-[85%] sm:px-5">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">{children}</h3>,
        h2: ({ children }) => <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">{children}</h3>,
        h3: ({ children }) => <h3 className="mb-2 mt-4 border-t border-slate-100 pt-4 text-sm font-bold text-slate-950 first:mt-0 first:border-0 first:pt-0">{children}</h3>,
        p: ({ children }) => <p className="mb-3 break-words last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 marker:text-blue-600 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-blue-700 last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="break-words pl-0.5">{children}</li>,
        a: ({ href, children }) => href && assistantLinks.has(href)
          ? <Link href={href} className="mr-2 inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-800 no-underline transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{children}<ArrowUpRight aria-hidden="true" size={13} /></Link>
          : <span>{children}</span>,
        img: () => null,
        blockquote: ({ children }) => <aside role="alert" className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-amber-950 first:mt-0 last:mb-0">
          <TriangleAlert aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" size={18} />
          <div className="min-w-0 flex-1 [&>p]:mb-0">{children}</div>
        </aside>,
        code: ({ children }) => <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-900">{children}</code>,
        table: ({ children }) => <div className="mb-3 max-w-full overflow-x-auto"><table className="w-full border-collapse text-left text-xs">{children}</table></div>,
        th: ({ children }) => <th className="border-b border-slate-200 bg-slate-50 px-2 py-1.5 font-semibold">{children}</th>,
        td: ({ children }) => <td className="border-b border-slate-100 px-2 py-1.5 align-top">{children}</td>,
        hr: () => <hr className="my-4 border-slate-200" />,
      }}
    >{content}</ReactMarkdown>
  </div>;
}

function AssistantAvatar({ large = false }: { large?: boolean }) {
  return <span className={large ? "relative block h-14 w-14 shrink-0" : "relative block h-10 w-10 shrink-0"}>
    <Image src="/images/aiGara.png" alt="Trợ lý AutoCare AI" fill sizes={large ? "56px" : "40px"} className="object-contain" />
  </span>;
}

export function AiAssistantPage({ customerName }: { customerName: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (messages.length || busy) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, busy]);

  async function send(content: string) {
    const question = content.trim();
    if (!question || busy || !customerName) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
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
      const result = await response.json() as { reply?: string; error?: string };
      if (!response.ok || !result.reply) throw new Error(result.error ?? "Trợ lý AI chưa phản hồi được.");
      setMessages((current) => [...current, { role: "assistant", content: result.reply! }]);
    } catch (failure) {
      setMessages((current) => current.slice(0, -1));
      setDraft(question);
      setError(notifyError(failure, "Không gửi được câu hỏi. Vui lòng thử lại."));
    } finally { setBusy(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(draft); }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(draft); }
  }

  return <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"><Sparkles size={14} /> Trợ lý AutoCare AI</div><h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Hỏi về dịch vụ và chiếc xe của bạn</h1><p className="mt-2 text-sm text-slate-600">Tư vấn từ danh mục gara và hồ sơ của chính bạn khi đã đăng nhập.</p></div><Link href="/appointments" className="btn btn-soft"><CalendarDays size={16} /> Đặt lịch kiểm tra</Link></div>
    <section className="card overflow-hidden" aria-label="Trò chuyện với trợ lý AI">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><div className="flex items-center gap-3"><AssistantAvatar large /><div><h2 className="text-sm font-semibold text-slate-900">Trợ lý khách hàng</h2><p className="text-xs text-slate-500">Thông tin từ hệ thống gara</p></div></div>{messages.length > 0 && <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100" onClick={() => { setMessages([]); setError(""); }} disabled={busy}><RotateCcw size={14} /> Cuộc trò chuyện mới</button>}</div>
      <div className="max-h-[560px] min-h-[380px] space-y-5 overflow-y-auto bg-slate-50/70 px-4 py-6 sm:px-6" aria-live="polite">
        {messages.length === 0 && !busy && <div className="flex justify-center"><Image src="/images/aiGara.png" alt="Robot AutoCare AI chào đón bạn" width={180} height={148} sizes="180px" className="h-auto w-36 object-contain sm:w-44" /></div>}
        <div className="flex items-start gap-3"><AssistantAvatar /><div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">{customerName ? "Chào " + customerName + "! Mình có thể giúp bạn xem dịch vụ, lịch hẹn, tiến độ sửa chữa và hóa đơn của bạn." : "Chào bạn! Hãy đăng nhập tài khoản khách hàng để mình có thể tư vấn theo hồ sơ xe của bạn."}</div></div>
        {messages.map((message, index) => <div key={index} className={"flex items-start gap-3 " + (message.role === "user" ? "justify-end" : "")}>{message.role === "assistant" && <AssistantAvatar />}{message.role === "assistant" ? <AssistantMessage content={message.content} /> : <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-blue-700 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">{message.content}</div>}{message.role === "user" && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600"><UserRound size={16} /></span>}</div>)}
        {busy && <div className="flex items-center gap-3"><AssistantAvatar /><p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Đang tìm thông tin và soạn câu trả lời…</p></div>}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
        {customerName ? <><div className="mb-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={busy} onClick={() => void send(suggestion)} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-800 hover:bg-blue-100 disabled:opacity-50">{suggestion}</button>)}</div><form onSubmit={submit} className="flex items-end gap-2"><label className="sr-only" htmlFor="customer-ai-question">Câu hỏi của bạn</label><textarea id="customer-ai-question" className="field min-h-12 max-h-32 flex-1 resize-y py-3" rows={1} maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} placeholder="Nhập câu hỏi của bạn…" disabled={busy} /><button type="submit" className="btn btn-primary h-12 shrink-0" disabled={busy || !draft.trim()}><Send size={16} /><span className="hidden sm:inline">Gửi</span></button></form></> : <Link href="/login" className="btn btn-primary">Đăng nhập để trò chuyện</Link>}
        {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
        <p className="mt-3 text-xs text-slate-500">Tư vấn AI chỉ mang tính tham khảo; kỹ thuật viên sẽ xác nhận tình trạng xe sau khi kiểm tra thực tế.</p>
      </div>
    </section>
  </div>;
}
