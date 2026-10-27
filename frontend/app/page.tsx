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

export default function Home() {}
