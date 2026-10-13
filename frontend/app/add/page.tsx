"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://as-tedu.vercel.app/";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type Subject = { title: string; prof: string };

async function uploadToCloudinary(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body },
  );
  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.secure_url;
}

export default function Add() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/subjects`)
      .then((r) => r.json())
      .then(setSubjects);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const subject = data.get("subject") as string;
    const title = data.get("title") as string;
    const author = data.get("author") as string;
    const files = data.getAll("files") as File[];

    setSubmitting(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));

      for (let i = 0; i < files.length; i++) {
        const res = await fetch(
          `${API_URL}/subjects/${encodeURIComponent(subject)}/summaries`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: files.length > 1 ? `${title} (${i + 1})` : title,
              author,
              fileUrl: urls[i],
              fileType: files[i].type === "application/pdf" ? "pdf" : "image",
            }),
          },
        );
        if (!res.ok) throw new Error("Save failed");
      }

      form.reset();
      alert("تم نشر الملخص");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء النشر");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-[42px] w-full rounded-sm border border-neutral-300 bg-white px-3 text-base outline-none focus:border-[#4285f4]";

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-white/75" />

      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-16 pt-8">
        <h1 className="text-3xl font-medium text-neutral-700 sm:text-4xl">
          أضف ملخصاً
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-5 rounded-sm border border-neutral-300 bg-white p-6"
        >
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm text-neutral-700"
            >
              المادة
            </label>
            <select
              id="subject"
              name="subject"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                اختر المادة
              </option>
              {subjects.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm text-neutral-700"
            >
              عنوان الملخص
            </label>
            <input
              id="title"
              name="title"
              dir="auto"
              maxLength={120}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="mb-1.5 block text-sm text-neutral-700"
            >
              اسم الرافع
            </label>
            <input
              id="author"
              name="author"
              dir="auto"
              maxLength={40}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="files"
              className="mb-1.5 block text-sm text-neutral-700"
            >
              ملفات الملخص
            </label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              required
              accept="image/*,application/pdf"
              className="block w-full rounded-sm border border-dashed border-neutral-400 bg-white p-3 text-sm text-neutral-600 file:ms-0 file:me-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm hover:border-[#4285f4]"
            />
            <p className="mt-2 text-xs text-neutral-500">
              صور أو PDF، حتى 5 ملفات وكل ملف حتى 10MB.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-[42px] rounded-sm bg-[#4285f4] text-white hover:bg-[#3b78e0] disabled:opacity-60"
          >
            {submitting ? "جاري النشر..." : "نشر الملخص"}
          </button>
        </form>
      </main>
    </div>
  );
}
