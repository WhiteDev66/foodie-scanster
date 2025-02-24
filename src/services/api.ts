
import { Product, SearchResponse } from "../types/api";

const API_URL = "https://world.openfoodfacts.org/api/v2";

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API did not return JSON!");
  }
  return response.json();
}

export async function searchProducts(query: string): Promise<SearchResponse> {
  const response = await fetch(
    `${API_URL}/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments`
  );
  const data = await handleResponse(response);
  if (!data.products) {
    throw new Error("Invalid API response format");
  }
  return data;
}

export async function getProduct(barcode: string): Promise<Product> {
  if (!barcode) {
    throw new Error("Barcode is required");
  }
  
  const response = await fetch(
    `${API_URL}/product/${barcode}?fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments`
  );
  const data = await handleResponse(response);
  
  if (!data.product) {
    throw new Error("Product not found");
  }
  
  return data.product;
}

// Fonction utilitaire pour vérifier si un produit existe
export async function checkProductExists(barcode: string): Promise<boolean> {
  try {
    await getProduct(barcode);
    return true;
  } catch (error) {
    return false;
  }
}
