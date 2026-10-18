"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatWidget.css";
const API_URL = "https://as-tedu.vercel.app/api/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "حصلت مشكلة، جرب تاني");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      // رجّع الرسالة لمربع الكتابة عشان المستخدم يعيد الإرسال بسهولة
      setMessages(messages);
      setInput(text);
      setError(
        err instanceof TypeError
          ? "مفيش اتصال بالسيرفر، جرب تاني"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-root" dir="rtl">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="مساعد ASTedu">
          <div className="chat-header">
            <span>مساعد ASTedu</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق">
              ✕
            </button>
          </div>

          <div className="chat-messages">
            <div className="chat-bubble bot">
              أهلاً! اسألني عن المواد المتاحة أو عن الملخصات، أو اطلب شرح أي
              مفهوم دراسي.
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble ${m.role === "user" ? "user" : "bot"}`}
              >
                {m.role === "user" ? (
                  m.content
                ) : (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble bot typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {error && <div className="chat-error">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form className="chat-form" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك..."
              maxLength={500}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              إرسال
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="افتح الشات"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
