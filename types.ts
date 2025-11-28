export interface MenuItem {
  id: string;
  name: string;
  price?: number; // Price is optional, for display only during selection
  description?: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
  required: boolean; // If true, user must select one
  multiSelect: boolean; // If true, user can select multiple (e.g., A La Carte)
}

export interface FullMenu {
  soup: MenuCategory;
  appetizer: MenuCategory;
  main: MenuCategory;
  aLaCarte: MenuCategory;
}

export interface UserOrder {
  userName: string;
  soup?: MenuItem;
  appetizer?: MenuItem;
  main?: MenuItem;
  aLaCarte: MenuItem[];
  notes: string;
  isConfirmed: boolean;
}

export const FAMILY_MEMBERS = ["Jackson", "Stella", "Ai Ning", "Channing"] as const;
export type FamilyMember = typeof FAMILY_MEMBERS[number];
