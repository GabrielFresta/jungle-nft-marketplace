export type Category = "Gaming" | "Art" | "Collectibles" | "Virtual World";
export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface Nft {
  id: string;
  title: string;
  creator: string;
  price: string;
  category: Category;
  rarity: Rarity;
  image: string;
  description: string;
  available: number;
  version: number;
}

export interface NftListResponse {
  items: Nft[];
  total: number;
  page: number;
  pageSize: number;
}
