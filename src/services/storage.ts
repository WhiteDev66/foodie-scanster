
import { Product, SavedProduct } from "../types/api";

const HISTORY_STORAGE_KEY = "foodie_scan_history";
const FAVORITES_STORAGE_KEY = "foodie_scan_favorites";
const HISTORY_MAX_ITEMS = 20;

// Helper pour obtenir les données depuis le localStorage
const getStoredItems = (key: string): SavedProduct[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return [];
  }
};

// Helper pour sauvegarder les données dans localStorage
const storeItems = (key: string, items: SavedProduct[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

// Ajouter un produit à l'historique
export const addToHistory = (product: Product): void => {
  const history = getStoredItems(HISTORY_STORAGE_KEY);
  
  // Vérifier si le produit existe déjà
  const existingIndex = history.findIndex(item => item.code === product.code);
  
  // Créer un objet SavedProduct
  const savedProduct: SavedProduct = {
    ...product,
    savedAt: Date.now(),
    isFavorite: existingIndex >= 0 ? history[existingIndex].isFavorite : false
  };
  
  // Si le produit existe déjà, le supprimer
  if (existingIndex >= 0) {
    history.splice(existingIndex, 1);
  }
  
  // Ajouter le produit au début de l'historique
  history.unshift(savedProduct);
  
  // Limiter la taille de l'historique
  const trimmedHistory = history.slice(0, HISTORY_MAX_ITEMS);
  
  // Sauvegarder l'historique mis à jour
  storeItems(HISTORY_STORAGE_KEY, trimmedHistory);
};

// Récupérer l'historique
export const getHistory = (): SavedProduct[] => {
  return getStoredItems(HISTORY_STORAGE_KEY);
};

// Effacer l'historique
export const clearHistory = (): void => {
  storeItems(HISTORY_STORAGE_KEY, []);
};

// Ajouter un produit aux favoris
export const toggleFavorite = (product: Product): boolean => {
  // Récupérer les favoris existants
  const favorites = getStoredItems(FAVORITES_STORAGE_KEY);
  const history = getStoredItems(HISTORY_STORAGE_KEY);
  
  // Vérifier si le produit est déjà dans les favoris
  const existingIndex = favorites.findIndex(item => item.code === product.code);
  const newFavoriteState = existingIndex < 0;
  
  if (newFavoriteState) {
    // Ajouter aux favoris
    const savedProduct: SavedProduct = {
      ...product,
      savedAt: Date.now(),
      isFavorite: true
    };
    favorites.unshift(savedProduct);
    storeItems(FAVORITES_STORAGE_KEY, favorites);
  } else {
    // Supprimer des favoris
    favorites.splice(existingIndex, 1);
    storeItems(FAVORITES_STORAGE_KEY, favorites);
  }
  
  // Mettre à jour l'état de favori dans l'historique
  const historyIndex = history.findIndex(item => item.code === product.code);
  if (historyIndex >= 0) {
    history[historyIndex].isFavorite = newFavoriteState;
    storeItems(HISTORY_STORAGE_KEY, history);
  }
  
  return newFavoriteState;
};

// Récupérer les favoris
export const getFavorites = (): SavedProduct[] => {
  return getStoredItems(FAVORITES_STORAGE_KEY);
};

// Vérifier si un produit est un favori
export const isFavorite = (productCode: string): boolean => {
  const favorites = getStoredItems(FAVORITES_STORAGE_KEY);
  return favorites.some(item => item.code === productCode);
};

// Partager un produit
export const shareProduct = async (product: Product): Promise<boolean> => {
  if (!navigator.share) {
    console.error("Web Share API not supported");
    return false;
  }

  try {
    const text = `${product.product_name || "Food product"} - Nutriscore: ${product.nutriscore_grade?.toUpperCase() || "N/A"}`;
    
    await navigator.share({
      title: product.product_name || "Food product",
      text: text,
      url: `${window.location.origin}/product/${product.code}`
    });
    
    return true;
  } catch (error) {
    console.error("Error sharing product:", error);
    return false;
  }
};
