import { UserOrder, FullMenu, MenuItem } from '../types';
import { INITIAL_MENU } from '../constants';

const STORAGE_KEY = 'family_dinner_orders_2025_v1';

// Compact structure to keep URLs short
interface CompactOrder {
  u: string; // User Name
  s: string; // Soup ID
  ap: string; // Appetizer ID
  m: string; // Main ID
  al: string[]; // A La Carte IDs
  n: string; // Notes
}

// Helper to find item by ID in the full menu
const findItem = (id: string, menu: FullMenu): MenuItem | undefined => {
  const allItems = [
    ...menu.soup.items,
    ...menu.appetizer.items,
    ...menu.main.items,
    ...menu.aLaCarte.items
  ];
  return allItems.find(i => i.id === id);
};

export const storageService = {
  // Load from LocalStorage
  getOrders: (): Record<string, UserOrder> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    }
    return {};
  },

  // Save to LocalStorage
  saveOrders: (orders: Record<string, UserOrder>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  },

  // Encode orders into a Base64 string for URL sharing
  encodeOrdersToUrl: (orders: Record<string, UserOrder>): string => {
    const compactList: CompactOrder[] = Object.values(orders).map(o => ({
      u: o.userName,
      s: o.soup?.id || '',
      ap: o.appetizer?.id || '',
      m: o.main?.id || '',
      al: o.aLaCarte.map(i => i.id),
      n: o.notes
    }));
    return btoa(JSON.stringify(compactList));
  },

  // Decode from URL and merge with existing menu/orders
  decodeOrdersFromUrl: (base64Str: string, currentMenu: FullMenu = INITIAL_MENU): Record<string, UserOrder> => {
    try {
      const jsonStr = atob(base64Str);
      const compactList: CompactOrder[] = JSON.parse(jsonStr);
      const newOrders: Record<string, UserOrder> = {};

      compactList.forEach(c => {
        // Reconstruct full UserOrder object
        const soup = findItem(c.s, currentMenu);
        const appetizer = findItem(c.ap, currentMenu);
        const main = findItem(c.m, currentMenu);
        const aLaCarte = c.al.map(id => findItem(id, currentMenu)).filter((i): i is MenuItem => !!i);

        if (c.u) {
            newOrders[c.u] = {
            userName: c.u,
            soup,
            appetizer,
            main,
            aLaCarte,
            notes: c.n,
            isConfirmed: true
            };
        }
      });
      return newOrders;
    } catch (e) {
      console.error("Failed to parse shared orders", e);
      return {};
    }
  }
};