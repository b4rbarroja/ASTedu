import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex h-[68px] items-center justify-center gap-6 border-b border-neutral-200 bg-white/80 px-6 text-sm text-neutral-700 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300">
      <Link href="/" className="hover:text-black dark:hover:text-white">
        الرئيسية
      </Link>
      <Link href="/add" className="hover:text-black dark:hover:text-white">
        أضف ملخصاً
      </Link>
    </header>
  );
}
