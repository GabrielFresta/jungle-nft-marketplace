import { http, HttpResponse } from "msw";
import { nfts } from "./data";
import type { NftListResponse } from "../types/nft";

export const handlers = [
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const category = url.searchParams.get("category");
    const sort = url.searchParams.get("sort");
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const pageSize = Math.max(1, Number(url.searchParams.get("pageSize") ?? 8));

    let result = nfts.filter(
      (n) =>
        (n.title.toLowerCase().includes(q) ||
          n.creator.toLowerCase().includes(q)) &&
        (!category || n.category === category),
    );

    if (sort === "price_asc")
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price_desc")
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));

    const body: NftListResponse = {
      items: result.slice((page - 1) * pageSize, page * pageSize),
      total: result.length,
      page,
      pageSize,
    };
    return HttpResponse.json(body);
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((n) => n.id === params.id);
    if (!nft)
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    return HttpResponse.json(nft);
  }),
];
