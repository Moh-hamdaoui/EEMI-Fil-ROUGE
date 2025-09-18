// app/components/Nav.tsx (ou où tu veux)
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-xl tracking-wider text-white"
        >
          LOGO
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/inscription"
            className="rounded-xl bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          >
            Inscription
          </Link>
          <Link
            href="/connexion"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}
