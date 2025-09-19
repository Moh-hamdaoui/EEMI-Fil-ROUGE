import Image from 'next/image';
import RelatedProducts from '@/app/products/related-products';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://node-eemi.vercel.app';

async function getProduct(id: string): Promise<Product> {
  const r = await fetch(`${API_BASE}/api/products/${id}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Not found');
  const data: unknown = await r.json();

  // Garde de type minimale
  const isProduct = (x: unknown): x is Product =>
    typeof x === 'object' &&
    x !== null &&
    'id' in x &&
    'name' in x &&
    'description' in x &&
    'price' in x &&
    'imageUrl' in x &&
    'isAvailable' in x;

  if (!isProduct(data)) throw new Error('Invalid API shape');
  return data;
}

// ⚠️ Ici on "await" params car ton PageProps attend un Promise
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProduct(id);

  return (
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-4xl font-extrabold">{p.name}</h1>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" unoptimized />
            {!p.isAvailable && (
              <div className="pointer-events-none absolute inset-0">
                <span
                  className="absolute bottom-4 right-4 inline-flex items-center rounded-2xl px-4 py-2
                             text-white font-semibold bg-rose-500/95 shadow-lg ring-1 ring-white/20"
                >
                  Produit indisponible
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-3xl bg-neutral-900/70 p-6 ring-1 ring-neutral-800">
            <div>
              <h2 className="text-white text-3xl font-semibold">Description</h2>
              <p className="text-neutral-400">{p.description}</p>
            </div>

            <hr className="border-neutral-800" />

            <div className="flex items-end gap-3">
              <span className="rounded-xl h-11 bg-white px-6 py-2 font-bold text-black inline-flex items-center">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p.price)}
              </span>
              <button
                disabled={!p.isAvailable}
                className="w-52 rounded-xl px-5 py-2.5 font-medium
                           text-white bg-[#f79a2f] hover:bg-[#f79a2f]/90
                           disabled:bg-neutral-700 disabled:text-neutral-300
                           disabled:hover:bg-neutral-700 disabled:cursor-not-allowed"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        <RelatedProducts currentId={p.id} />
      </div>
    </main>
  );
}
