export interface Category {
  id: number;
  name: string;
  slug: string;
  path: string;
  parentId: number | null;
  depth: number;
  displayOrder: number;
  description: string | null;
  isActive: boolean;
}
export interface CategoryNode {
  category: Category;
  children: CategoryNode[];
}

export interface CategoryApiResponse {
  data: CategoryNode[];
  message: string | null;
}
