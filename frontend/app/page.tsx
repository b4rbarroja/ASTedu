"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = "https://as-tedu.vercel.app";

type Subject = {
  title: string;
  prof: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-neutral-600 dark:fill-neutral-400"
      aria-hidden="true"
    >
      <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSubjects() {
      try {
        const res = await fetch(`${API_URL}/subjects`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Request failed");
        const data: Subject[] = await res.json();
        setSubjects(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadSubjects();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return subjects;
    return subjects.filter((s) => {
      const name = normalize(s.title);
      return words.every((w) => name.includes(w));
    });
  }, [query, subjects]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" />
      <main className="flex flex-1 flex-col items-center px-4 pt-10 sm:pt-14">
        <h1 className="text-5xl font-medium tracking-tight text-neutral-600 dark:text-neutral-300 sm:text-6xl">
          ASTedu
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex w-full max-w-[632px] shadow-sm"
          role="search"
        >
          <button
            type="submit"
            aria-label="بحث"
            className="flex h-[42px] w-[44px] items-center justify-center rounded-s-sm bg-[#4285f4] hover:bg-[#3b78e0]"
          >
            <SearchIcon />
          </button>
          <input
            name="q"
            type="search"
            dir="auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن ملخص أو مادة"
            className="h-[42px] flex-1 rounded-e-sm border border-neutral-300 bg-white px-3 text-base outline-none focus:border-[#4285f4] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </form>

        {loading ? (
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            جاري تحميل المواد...
          </p>
        ) : error ? (
          <p className="mt-8 text-sm text-red-600 dark:text-red-400">
            تعذر تحميل المواد، حاول مرة أخرى لاحقاً
          </p>
        ) : filtered.length > 0 ? (
          <ul className="mt-8 flex max-w-[632px] flex-wrap justify-center gap-2">
            {filtered.map((s) => (
              <li key={s.title}>
                <Link
                  href={`/${encodeURIComponent(s.title)}`}
                  className="inline-block rounded-sm border border-neutral-300 bg-white px-4 py-1.5 text-sm hover:border-[#4285f4] hover:text-[#4285f4] dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-[#6ea8ff]"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            لا يوجد مادة بهذا الاسم، جرب غيره
          </p>
        )}
        <Link
          href="/add"
          className="mt-8 text-lg text-[#0b6b2f] hover:underline dark:text-[#4ade80]"
        >
          أضف ملخصا
        </Link>
        <p className="mt-8 text-lg text-center text-[#0b6b2f] hover:underline dark:text-[#4ade80]">
          بكل بساطة هو موقع مفتوح للجميع لتصفح أو إضافة الملخصات بصيغ pdf و صور
        </p>
      </main>
    </div>
  );
}
