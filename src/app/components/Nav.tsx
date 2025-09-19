'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCount } from "@/lib/cart";

const BRAND = "#f79a2f";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://node-eemi.vercel.app";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) return setAuthed(false);
    try {
      const r = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      setAuthed(r.ok);
    } catch { setAuthed(true); }
  }

  useEffect(() => {
    setHydrated(true);
    checkAuth();
    setCartCount(getCount());
  }, []);

  useEffect(() => {
    const onAuth = () => checkAuth();
    const onCart = () => setCartCount(getCount());
    window.addEventListener('auth:change', onAuth);
    window.addEventListener('cart:change', onCart);
    return () => {
      window.removeEventListener('auth:change', onAuth);
      window.removeEventListener('cart:change', onCart);
    };
  }, []);

  useEffect(() => { checkAuth(); }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('auth:change'));
    router.push("/login");
  };

  const CartButton = (
    <Link
      href="/cart"
      aria-label={`Aller au panier (${cartCount})`}
      className="relative rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="16" cy="20" r="1.5" />
        <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6l1.2-6.2H7.1" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 grid min-w-[1.25rem] h-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-orange-600">
          {cartCount}
        </span>
      )}
      <span className="sr-only">Panier</span>
    </Link>
  );

  return (
    <nav className="bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1 text-xl tracking-wider text-white">LOGO</Link>

        {hydrated && authed ? (
          <div className="flex items-center gap-3">
            {CartButton}
            <Link href="/profile" className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-95" style={{ backgroundColor: BRAND }}>
              Mon profile
            </Link>
            <button onClick={logout} className="rounded-xl bg-rose-500/95 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-500">
              Me déconnecter
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {CartButton}
            <Link href="/register" className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600">
              Inscription
            </Link>
            <Link href="/login" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400">
              Connexion
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
