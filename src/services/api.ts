
import { Product, SearchResponse } from "../types/api";

const API_URL = "https://world.openfoodfacts.org/api/v2";

export async function searchProducts(query: string): Promise<SearchResponse> {
  const response = await fetch(
    `${API_URL}/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments`
  );
  return response.json();
}

export async function getProduct(barcode: string): Promise<Product> {
  const response = await fetch(
    `${API_URL}/product/${barcode}?fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments`
  );
  const data = await response.json();
  return data.product;
}
