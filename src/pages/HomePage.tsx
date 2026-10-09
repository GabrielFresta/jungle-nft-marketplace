import { Link, getRouteApi } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNfts } from "../api/nfts";

const route = getRouteApi("/");
const CATEGORIES = ["Gaming", "Art", "Collectibles", "Virtual World"];

export function HomePage() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["nfts", search],
    queryFn: ({ signal }) => fetchNfts(search, signal),
    placeholderData: keepPreviousData,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;
  const page = search.page ?? 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold text-emerald-400">
            Jungle Marketplace
          </span>
          <label className="w-full sm:w-80">
            <span className="sr-only">Buscar por nome ou criador</span>
            <input
              type="search"
              placeholder="Buscar por nome ou criador..."
              value={search.q ?? ""}
              onChange={(e) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    q: e.target.value || undefined,
                    page: undefined,
                  }),
                  replace: true,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </label>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {["Todos", ...CATEGORIES].map((c) => {
              const active = (search.category ?? "Todos") === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        category: c === "Todos" ? undefined : c,
                        page: undefined,
                      }),
                    })
                  }
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
                    active
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "bg-slate-900 border border-slate-800 text-slate-300"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            Ordenar por preço
            <select
              value={search.sort ?? ""}
              onChange={(e) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    sort: (e.target.value || undefined) as
                      | "price_asc"
                      | "price_desc"
                      | undefined,
                    page: undefined,
                  }),
                })
              }
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2"
            >
              <option value="">Padrão</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </label>
        </div>

        {isPending ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            aria-busy="true"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-900 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="text-center py-20 bg-slate-900/50 rounded-2xl border border-red-900"
          >
            <p className="mb-4">Não foi possível carregar os NFTs.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl"
            >
              Tentar novamente
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            Nenhum NFT encontrado para os filtros selecionados.
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {data.items.map((nft) => (
                <article
                  key={nft.id}
                  className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-5">
                    <span className="text-xs text-emerald-400 uppercase">
                      {nft.category}
                    </span>
                    <h3 className="font-bold mt-1">
                      <Link
                        to="/nft/$id"
                        params={{ id: nft.id }}
                        className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-emerald-400"
                      >
                        {nft.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-400">Por {nft.creator}</p>
                    <p className="mt-3 font-extrabold">{nft.price} ETH</p>
                  </div>
                </article>
              ))}
            </div>

            <nav
              aria-label="Paginação"
              className="flex items-center justify-center gap-4 mt-10"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })
                }
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-300">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })
                }
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40"
              >
                Próxima
              </button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}
