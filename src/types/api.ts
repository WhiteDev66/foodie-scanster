
export interface Product {
  code: string;
  product_name: string;
  image_url: string;
  nutriscore_grade?: string;
  nova_group?: string;
  ingredients_text?: string;
  nutrition_grades_tags?: string[];
  labels_tags?: string[];
  categories_tags?: string[];
  nutriments?: {
    [key: string]: number;
  };
  status?: number;
  status_verbose?: string;
}

export interface SavedProduct extends Product {
  savedAt: number; // timestamp when the product was saved
  isFavorite?: boolean; // whether the product is a favorite
}

export interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
  skip?: number;
  status?: number;
  status_verbose?: string;
}

export interface ApiError {
  status: number;
  status_verbose: string;
  error: string;
}
