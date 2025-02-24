
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
}

export interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
}
