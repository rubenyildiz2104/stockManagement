export type Category = string;

export type Size = string;

export interface Garment {
  id: string;
  serialNumber: string;
  name: string;
  brand: string;
  model: string;
  category: Category;
  size: Size;
  color: string;
  price: number;
  currentStock: number;
  dateAdded: string;
}

export type View = 'dashboard' | 'inventory' | 'add-garment' | 'reports' | 'settings';
