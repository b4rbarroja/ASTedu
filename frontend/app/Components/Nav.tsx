import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex h-[68px] items-center justify-center gap-6 border-b border-neutral-200 bg-white/80 px-6 text-sm text-neutral-700 backdrop-blur">
      <Link href="/" className="hover:text-black">
        الرئيسية
      </Link>
      <Link href="/add" className="hover:text-black">
        أضف ملخصاً
      </Link>
    </header>
  );
}
