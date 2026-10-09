import { useState } from "react";
import {
  Link,
  getRouteApi,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { fetchNft } from "../api/nfts";

const route = getRouteApi("/nft/$id");

export function NftDetailPage() {
  const { id } = route.useParams();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [added, setAdded] = useState(false);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["nft", id],
    queryFn: ({ signal }) => fetchNft(id, signal),
    retry: (count, err) =>
      !(isAxiosError(err) && err.response?.status === 404) && count < 2,
  });

  const notFound = isAxiosError(error) && error.response?.status === 404;

  const handleAddToCart = () => {
    if (!data) return;

    const savedCart = localStorage.getItem("jungle_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    if (!cart.some((item: { id: string }) => item.id === data.id)) {
      cart.push({
        id: data.id,
        title: data.title,
        price: data.price,
        image: data.image,
        creator: data.creator,
        currency: "ETH",
      });
      localStorage.setItem("jungle_cart", JSON.stringify(cart));

      // Dispara o evento para o contador do header atualizar na hora
      window.dispatchEvent(new Event("cartUpdated"));
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {canGoBack ? (
          <button
            type="button"
            onClick={() => router.history.back()}
            className="text-sm text-emerald-400 hover:underline cursor-pointer"
          >
            ← Voltar ao catálogo
          </button>
        ) : (
          <Link
            to="/"
            search={{
              q: undefined,
              category: undefined,
              sort: undefined,
              page: undefined,
            }}
            className="text-sm text-emerald-400 hover:underline"
          >
            ← Voltar ao catálogo
          </Link>
        )}

        {isPending ? (
          <div className="mt-8 grid md:grid-cols-2 gap-8" aria-busy="true">
            <div className="aspect-square rounded-2xl bg-slate-900 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-slate-900 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-slate-900 animate-pulse" />
              <div className="h-24 rounded bg-slate-900 animate-pulse" />
            </div>
          </div>
        ) : notFound ? (
          <div
            role="alert"
            className="mt-8 text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800"
          >
            <h1 className="text-2xl font-bold mb-2">NFT não encontrado</h1>
            <p className="text-slate-400">
              O NFT "{id}" não existe ou foi removido.
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-8 text-center py-20 bg-slate-900/50 rounded-2xl border border-red-900"
          >
            <p className="mb-4">Não foi possível carregar este NFT.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <article className="mt-8 grid md:grid-cols-2 gap-8 items-start">
            <img
              src={data.image}
              alt={data.title}
              className="w-full aspect-square object-cover rounded-2xl border border-slate-800"
            />
            <div className="flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {data.category} {data.rarity ? `• ${data.rarity}` : ""}
                </span>
                <h1 className="text-3xl font-black mt-1">{data.title}</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Por {data.creator}
                </p>
                <p className="mt-6 text-slate-300 leading-relaxed">
                  {data.description ||
                    "Ativo digital verificado e pronto para transferência na rede."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Preço atual
                </span>
                <p className="text-3xl font-black text-white mt-1">
                  {data.price} ETH
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {data.available > 0
                    ? `${data.available} unidades disponíveis`
                    : "Esgotado"}
                </p>

                <button
                  type="button"
                  disabled={data.available <= 0}
                  onClick={handleAddToCart}
                  className={`w-full mt-6 font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg ${
                    added
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/50"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added
                    ? "✓ Adicionado ao Carrinho!"
                    : "Adicionar ao Carrinho"}
                </button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
