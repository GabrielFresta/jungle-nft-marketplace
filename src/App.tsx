import { useState, useMemo } from "react";

// Types
interface NFT {
  id: string;
  title: string;
  creator: string;
  price: number;
  currency: string;
  image: string;
  category: "Gaming" | "Art" | "Collectibles" | "Virtual World";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  likes: number;
}

// Mock Data
const MOCK_NFTS: NFT[] = [
  {
    id: "1",
    title: "Jungle Cyber Warrior #001",
    creator: "CyberStudio",
    price: 2.5,
    currency: "ETH",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    category: "Gaming",
    rarity: "Legendary",
    likes: 142,
  },
  {
    id: "2",
    title: "Neo Metropolis Avatar",
    creator: "PixelMaster",
    price: 0.85,
    currency: "ETH",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80",
    category: "Collectibles",
    rarity: "Epic",
    likes: 89,
  },
  {
    id: "3",
    title: "Abstract Dimension #42",
    creator: "NovaArt",
    price: 1.2,
    currency: "ETH",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&auto=format&fit=crop&q=80",
    category: "Art",
    rarity: "Rare",
    likes: 67,
  },
  {
    id: "4",
    title: "Jungle Realm Pass",
    creator: "Jungle Gaming",
    price: 0.45,
    currency: "ETH",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    category: "Virtual World",
    rarity: "Common",
    likes: 215,
  },
];

const CATEGORIES = ["Todos", "Gaming", "Art", "Collectibles", "Virtual World"];

export default function App() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [sortBy, setSortBy] = useState<"low" | "high">("low");
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

  // Filter & Sort Logic
  const filteredNfts = useMemo(() => {
    return MOCK_NFTS.filter((nft) => {
      const matchesSearch =
        nft.title.toLowerCase().includes(search.toLowerCase()) ||
        nft.creator.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || nft.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      return sortBy === "low" ? a.price - b.price : b.price - a.price;
    });
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400">
              J
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Jungle Marketplace
            </span>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Buscar por nome ou criador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="button"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
          >
            Conectar Carteira
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Section */}
        <section className="mb-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              Desafio Técnico - Web3 & iGaming
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Explore a Próxima Geração de Digital Assets
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Plataforma de negociação de NFTs e ativos de jogos integrada à
              infraestrutura da Jungle Gaming.
            </p>
          </div>
        </section>

        {/* Filters Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">
              Ordenar por preço:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "low" | "high")}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
            </select>
          </div>
        </div>

        {/* NFT Cards Grid */}
        {filteredNfts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">
              Nenhum NFT encontrado para os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => setSelectedNft(nft)}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-800">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-slate-700/50">
                      {nft.rarity}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      {nft.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {nft.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Por <span className="text-slate-300">{nft.creator}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                      Preço
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {nft.price} {nft.currency}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* NFT Detail Modal */}
      {selectedNft && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 relative overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedNft(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedNft.image}
                alt={selectedNft.title}
                className="w-full sm:w-1/2 aspect-square object-cover rounded-2xl"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {selectedNft.category} • {selectedNft.rarity}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedNft.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Criado por {selectedNft.creator}
                  </p>
                  <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                    Ativo digital verificado e pronto para transferência na
                    rede.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Preço atual</span>
                  <p className="text-2xl font-black text-white">
                    {selectedNft.price} {selectedNft.currency}
                  </p>
                  <button
                    type="button"
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Confirmar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
