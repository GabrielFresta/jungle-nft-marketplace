import { useState, useEffect } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { HomePage } from "./pages/HomePage";
import { NftDetailPage } from "./pages/NftDetailPage";

interface CartItem {
  id: string;
  title: string;
  price: number | string;
  image: string;
}

function RootLayout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const savedCart = localStorage.getItem("jungle_cart");
      const savedUser = localStorage.getItem("jungle_user");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedUser) setUser(JSON.parse(savedUser));
    };

    updateState();

    window.addEventListener("storage", updateState);
    window.addEventListener("cartUpdated", updateState);

    return () => {
      window.removeEventListener("storage", updateState);
      window.removeEventListener("cartUpdated", updateState);
    };
  }, []);

  const handleRemoveFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("jungle_cart", JSON.stringify(updated));
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }
    setCart([]);
    localStorage.setItem("jungle_cart", JSON.stringify([]));
    setIsCartOpen(false);
    setPurchased(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const loggedUser = { email: emailInput.trim() };
    setUser(loggedUser);
    localStorage.setItem("jungle_user", JSON.stringify(loggedUser));
    setIsLoginOpen(false);
    setEmailInput("");
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            search={{
              q: undefined,
              category: undefined,
              sort: undefined,
              page: undefined,
            }}
            className="text-xl font-bold text-emerald-400"
          >
            Jungle Marketplace
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              🛒 Carrinho
              {cart.length > 0 && (
                <span className="bg-emerald-500 text-slate-950 font-bold text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{user.email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("jungle_user");
                  }}
                  className="text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm cursor-pointer"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 w-full max-w-md h-full p-6 flex flex-col justify-between border-l border-slate-800">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-12">
                  Seu carrinho está vazio.
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-emerald-400 font-bold">
                          {item.price} ETH
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-slate-500 hover:text-red-400 text-xs cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-400">Total</span>
                  <span className="font-bold text-white text-lg">
                    {cartTotal.toFixed(2)} ETH
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl cursor-pointer"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleLogin}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white">Entrar na Conta</h3>
            <p className="text-xs text-slate-400">
              Login simulado para concluir suas compras na plataforma.
            </p>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="seu-email@exemplo.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl cursor-pointer"
            >
              Entrar e Continuar
            </button>
          </form>
        </div>
      )}

      {purchased && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-2xl font-bold text-white">
              Pedido Confirmado!
            </h3>
            <p className="text-xs text-slate-400">
              Seus NFTs foram adquiridos com sucesso e já estão salvos no seu
              histórico.
            </p>
            <button
              type="button"
              onClick={() => setPurchased(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl cursor-pointer"
            >
              Voltar ao Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    category:
      typeof search.category === "string" && search.category
        ? search.category
        : undefined,
    sort:
      search.sort === "price_asc" || search.sort === "price_desc"
        ? (search.sort as "price_asc" | "price_desc")
        : undefined,
    page: Number(search.page) > 1 ? Number(search.page) : undefined,
  }),
  component: HomePage,
});

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: NftDetailPage,
});

const routeTree = rootRoute.addChildren([homeRoute, nftRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
