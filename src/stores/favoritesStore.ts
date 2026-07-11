import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FavoriteItem {
  brandSlug: string;
  modelSlug: string;
  name: string;
  brandName: string;
  img: string;
  price?: { amount: number; currency: string };
  addedAt: number;
}

interface FavoritesStore {
  items: FavoriteItem[];
  toggle: (item: Omit<FavoriteItem, "addedAt">) => void;
  remove: (brandSlug: string, modelSlug: string) => void;
  has: (brandSlug: string, modelSlug: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.find(
          (i) => i.brandSlug === item.brandSlug && i.modelSlug === item.modelSlug
        );
        if (exists) {
          set({
            items: get().items.filter(
              (i) => !(i.brandSlug === item.brandSlug && i.modelSlug === item.modelSlug)
            ),
          });
        } else {
          set({ items: [{ ...item, addedAt: Date.now() }, ...get().items] });
        }
      },
      remove: (brandSlug, modelSlug) =>
        set({
          items: get().items.filter(
            (i) => !(i.brandSlug === brandSlug && i.modelSlug === modelSlug)
          ),
        }),
      has: (brandSlug, modelSlug) =>
        !!get().items.find((i) => i.brandSlug === brandSlug && i.modelSlug === modelSlug),
      clear: () => set({ items: [] }),
    }),
    {
      name: "redline-favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
