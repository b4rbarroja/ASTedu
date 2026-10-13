import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://as-tedu.vercel.app";

type Subject = { title: string; prof: string };

type Summary = {
  id: number;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "image";
};

async function SubjectContent({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title: rawTitle } = await params;
  const title = decodeURIComponent(rawTitle);
  const encoded = encodeURIComponent(title);

  const [subjectRes, summariesRes] = await Promise.all([
    fetch(`${API_URL}/subjects/${encoded}`, { cache: "no-store" }),
    fetch(`${API_URL}/subjects/${encoded}/summaries`, { cache: "no-store" }),
  ]);

  if (subjectRes.status === 404) notFound();
  if (!subjectRes.ok || !summariesRes.ok) {
    throw new Error("Failed to load subject");
  }

  const subject: Subject = await subjectRes.json();
  const summaries: Summary[] = await summariesRes.json();

  return (
    <>
      <h1 className="text-4xl font-medium text-neutral-700">{subject.title}</h1>
      <p className="mt-2 text-neutral-600">د. {subject.prof}</p>

      <h2 className="mt-10 mb-4 text-xl text-neutral-700">الملخصات</h2>

      {summaries.length === 0 ? (
        <p className="text-sm text-neutral-600">
          لا توجد ملخصات لهذه المادة بعد
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {summaries.map((s) => (
            <li
              key={s.id}
              className="rounded-sm border border-neutral-300 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <span>{s.title}</span>
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#4285f4] hover:underline"
                >
                  {s.fileType === "pdf" ? "فتح PDF" : "عرض الصورة"}
                </a>
              </div>

              {s.fileType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.fileUrl}
                  alt={s.title}
                  className="mt-3 max-h-96 rounded-sm"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function SubjectPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 pt-8">
        <Suspense
          fallback={<p className="text-neutral-600">جاري التحميل...</p>}
        >
          <SubjectContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
