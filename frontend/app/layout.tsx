import { Noto_Sans_Arabic } from "next/font/google";
import type { Viewport } from "next";
import ChatWidget from "./Components/Chatwid";
import "./globals.css";

const font = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "AST",
  description: "Add, Summarize, Train !",
};

// Match the browser UI (mobile address bar, etc.) to the device theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${font.className} flex min-h-screen flex-col text-neutral-800 antialiased dark:text-neutral-200`}
      >
        <div className="text-center mt-[400px]">
          {" "}
          <h1 className="text-6xl">تم إغلاق الموقع بشكل نهائي</h1>
        </div>
      </body>
    </html>
  );
}
