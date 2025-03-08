import { Product, SearchResponse, SearchParams } from "../types/api";

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

export async function searchProducts(params: string | SearchParams): Promise<SearchResponse> {
  let query = typeof params === 'string' ? params : params.query;
  console.log("Searching for:", query);
  
  if (!query.trim()) {
    return { count: 0, page: 1, page_size: 0, products: [] };
  }
  
  // Get current language from i18n
  const language = localStorage.getItem('i18nextLng') || 'en';
  const langCode = language.substring(0, 2).toLowerCase();
  
  console.log("Current language code for API:", langCode);
  
  try {
    let apiUrl = `${API_URL}/search?search_terms=${encodeURIComponent(query)}&lc=${langCode}&fields=code,product_name,brands,brands_tags,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments&page_size=24`;
    
    // Add filters if provided
    if (typeof params !== 'string') {
      if (params.nutriscoreGrade) {
        apiUrl += `&nutrition_grades=${params.nutriscoreGrade.toLowerCase()}`;
      }
      
      if (params.novaGroup) {
        apiUrl += `&nova_groups=${params.novaGroup}`;
      }
      
      if (params.category) {
        apiUrl += `&categories_tags=${encodeURIComponent(params.category)}`;
      }
    }
    
    const response = await fetch(apiUrl);
    console.log("API Response status:", response.status);
    const data = await handleResponse(response);
    console.log("API Response data:", data);
    
    // If no results with brand, try a broader search
    if (!data.products?.length && typeof params === 'string') {
      const fallbackResponse = await fetch(
        `${API_URL}/search?search_terms=${encodeURIComponent(query)}&lc=${langCode}&fields=code,product_name,brands,brands_tags,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments&page_size=24`
      );
      const fallbackData = await handleResponse(fallbackResponse);
      data.products = fallbackData.products;
    }

    // Filter and sort results
    if (data.products) {
      const searchTerm = query.toLowerCase();
      data.products = data.products
        .filter(product => {
          if (!product.product_name) return false;
          const productName = product.product_name.toLowerCase();
          const brands = product.brands?.toLowerCase() || "";
          return productName.includes(searchTerm) || brands.includes(searchTerm);
        })
        .sort((a, b) => {
          const aName = a.product_name?.toLowerCase() || "";
          const bName = b.product_name?.toLowerCase() || "";
          // Prioritize products that start with the search term
          if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
          if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
          return 0;
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
  
  // Get current language from i18n
  const language = localStorage.getItem('i18nextLng') || 'en';
  const langCode = language.substring(0, 2).toLowerCase();
  
  try {
    // Using language code in API request
    const response = await fetch(
      `${API_URL}/product/${barcode}?fields=code,product_name,image_url,nutriscore_grade,nova_group,ingredients_text,nutrition_grades_tags,labels_tags,categories_tags,nutriments&lc=${langCode}`
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
