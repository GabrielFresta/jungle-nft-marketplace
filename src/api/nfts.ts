import { api } from "./client";
import type { Nft, NftListResponse } from "../types/nft";

export interface NftListParams {
  q?: string;
  category?: string;
  sort?: "price_asc" | "price_desc";
  page?: number;
}

export async function fetchNfts(params: NftListParams, signal?: AbortSignal) {
  const { data } = await api.get<NftListResponse>("/nfts", {
    params: { ...params, pageSize: 8 },
    signal,
  });
  return data;
}

export async function fetchNft(id: string, signal?: AbortSignal) {
  const { data } = await api.get<Nft>(`/nfts/${id}`, { signal });
  return data;
}
