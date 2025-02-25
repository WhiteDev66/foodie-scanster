
import { Product, SearchResponse } from "../types/api";

const API_URL = "https://world.openfoodfacts.org/api/v2";

async function handleResponse(response: Response) {
  if (!response.ok) {
    console.error("API Error:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Invalid content type:", contentType);
    throw new Error("API did not return JSON!");
  }
  return response.json();
}

export async function searchProducts(query: string): Promise<SearchResponse> {
  console.log("Searching for:", query);
  if (!query.trim()) {
    return { count: 0, page: 1, page_size: 0, products: [] };
  }
  
  try {
    // Utilisation des paramètres de recherche plus précis
    const response = await fetch(
      `${API_URL}/search?search_terms=${encodeURIComponent(query)}&fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments&tagtype_0=brands&tag_contains_0=contains&tag_0=${encodeURIComponent(query)}`
    );
    console.log("API Response status:", response.status);
    const data = await handleResponse(response);
    console.log("API Response data:", data);
    
    // Filtrer les résultats pour ne garder que ceux qui correspondent exactement au nom de marque
    if (data.products) {
      data.products = data.products.filter(product => {
        const productName = product.product_name?.toLowerCase() || "";
        const searchTerm = query.toLowerCase();
        return productName.includes(searchTerm);
      });
      data.count = data.products.length;
    }
    
    if (!data.products) {
      console.error("Invalid API response format:", data);
      throw new Error("Invalid API response format");
    }
    return data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

export async function getProduct(barcode: string): Promise<Product> {
  console.log("Getting product:", barcode);
  if (!barcode) {
    throw new Error("Barcode is required");
  }
  
  try {
    const response = await fetch(
      `${API_URL}/product/${barcode}?fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments`
    );
    console.log("API Response status:", response.status);
    const data = await handleResponse(response);
    console.log("API Response data:", data);
    
    if (!data.product) {
      throw new Error("Product not found");
    }
    
    return data.product;
  } catch (error) {
    console.error("Get product error:", error);
    throw error;
  }
}

export async function checkProductExists(barcode: string): Promise<boolean> {
  try {
    await getProduct(barcode);
    return true;
  } catch (error) {
    console.error("Check product error:", error);
    return false;
  }
}
