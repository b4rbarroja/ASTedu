import { Noto_Sans_Arabic } from "next/font/google";
import Navbar from "./Components/Nav";
import Footer from "./Components/Footer";
import "./globals.css";

const font = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "AST",
  description: "Add, Summarize, Train !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${font.className} flex min-h-screen flex-col text-neutral-800 antialiased`}
      >
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
