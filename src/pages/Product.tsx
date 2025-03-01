
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/api";
import { AlertCircle } from "lucide-react";

// Images génériques pour les catégories de produits
const GENERIC_IMAGES = {
  default: "/lovable-uploads/bb75613c-5fd1-4978-b9e8-09da991e4a56.png", // Image téléchargée par l'utilisateur
  dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop",
  beverage: "https://images.unsplash.com/photo-1596803244618-8dea998a9209?w=800&auto=format&fit=crop",
  snack: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop",
  meal: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&auto=format&fit=crop",
  fruit: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop",
  vegetable: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop",
  meat: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&auto=format&fit=crop",
  bakery: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop",
  sweet: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=800&auto=format&fit=crop",
};

// Fonction pour déterminer la catégorie du produit à partir des tags
const getCategoryFromTags = (product) => {
  if (!product.categories_tags || product.categories_tags.length === 0) {
    return 'default';
  }
  
  const tags = product.categories_tags.map(tag => tag.toLowerCase());
  
  if (tags.some(tag => tag.includes('dairy') || tag.includes('milk') || tag.includes('yogurt') || tag.includes('cheese'))) {
    return 'dairy';
  } else if (tags.some(tag => tag.includes('beverage') || tag.includes('drink') || tag.includes('juice') || tag.includes('water'))) {
    return 'beverage';
  } else if (tags.some(tag => tag.includes('snack') || tag.includes('chips') || tag.includes('crackers'))) {
    return 'snack';
  } else if (tags.some(tag => tag.includes('meal') || tag.includes('dish') || tag.includes('prepared'))) {
    return 'meal';
  } else if (tags.some(tag => tag.includes('fruit'))) {
    return 'fruit';
  } else if (tags.some(tag => tag.includes('vegetable'))) {
    return 'vegetable';
  } else if (tags.some(tag => tag.includes('meat') || tag.includes('poultry') || tag.includes('fish'))) {
    return 'meat';
  } else if (tags.some(tag => tag.includes('bread') || tag.includes('bakery') || tag.includes('pastry'))) {
    return 'bakery';
  } else if (tags.some(tag => tag.includes('sweet') || tag.includes('dessert') || tag.includes('chocolate') || tag.includes('candy'))) {
    return 'sweet';
  }
  
  return 'default';
};

// Récupérer l'image générique appropriée
const getGenericImage = (product) => {
  const category = getCategoryFromTags(product);
  return GENERIC_IMAGES[category] || GENERIC_IMAGES.default;
};

const Product = () => {
  const { barcode } = useParams();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => getProduct(barcode || ""),
    enabled: !!barcode,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="animate-pulse bg-white p-6 rounded-xl shadow-sm">
          Chargement du produit...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold mb-4 text-[#52769b]">Produit non trouvé</h1>
          <p className="text-gray-600">
            Désolé, nous n'avons pas trouvé le produit recherché.
          </p>
        </div>
      </div>
    );
  }

  const hasNutritionInfo = product.nutriments && (
    product.nutriments.energy_100g ||
    product.nutriments.proteins_100g ||
    product.nutriments.carbohydrates_100g ||
    product.nutriments.fat_100g
  );

  // Utiliser une image générique si aucune image n'est disponible
  const productImage = product.image_url || getGenericImage(product);

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={productImage}
                alt={product.product_name || "Image du produit"}
                className="w-full h-64 object-contain rounded-lg bg-[#FDE1D3] p-4 transition-all duration-300 hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-6">
              {!product.product_name && (
                <div className="flex items-center gap-2 p-3 bg-[#FEF7CD] text-amber-700 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">
                    Les informations de ce produit sont incomplètes.
                  </p>
                </div>
              )}
              
              <h1 className="text-2xl font-semibold text-[#3f5d82]">
                {product.product_name || `Produit (${barcode})`}
              </h1>
              
              {product.nutriscore_grade && (
                <div>
                  <h2 className="text-lg font-medium mb-2 text-[#52769b]">Nutriscore</h2>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#D3E4FD] text-[#3f5d82] font-bold">
                    {product.nutriscore_grade.toUpperCase()}
                  </div>
                </div>
              )}

              {hasNutritionInfo && (
                <div className="bg-[#E5DEFF]/30 p-4 rounded-lg">
                  <h2 className="text-lg font-medium mb-2 text-[#52769b]">Valeurs nutritionnelles (pour 100g)</h2>
                  <div className="space-y-2">
                    {product.nutriments.energy_100g && (
                      <p className="text-gray-600 bg-white/50 p-2 rounded-md">
                        Énergie: <span className="font-medium text-[#52769b]">{product.nutriments.energy_100g} {product.nutriments.energy_unit || 'kcal'}</span>
                      </p>
                    )}
                    {product.nutriments.proteins_100g && (
                      <p className="text-gray-600 bg-white/50 p-2 rounded-md">
                        Protéines: <span className="font-medium text-[#52769b]">{product.nutriments.proteins_100g}g</span>
                      </p>
                    )}
                    {product.nutriments.carbohydrates_100g && (
                      <p className="text-gray-600 bg-white/50 p-2 rounded-md">
                        Glucides: <span className="font-medium text-[#52769b]">{product.nutriments.carbohydrates_100g}g</span>
                      </p>
                    )}
                    {product.nutriments.fat_100g && (
                      <p className="text-gray-600 bg-white/50 p-2 rounded-md">
                        Matières grasses: <span className="font-medium text-[#52769b]">{product.nutriments.fat_100g}g</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {product.ingredients_text && (
                <div className="bg-[#F2FCE2]/40 p-4 rounded-lg">
                  <h2 className="text-lg font-medium mb-2 text-[#52769b]">Ingrédients</h2>
                  <p className="text-gray-600">{product.ingredients_text}</p>
                </div>
              )}

              {product.labels_tags && product.labels_tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium mb-2 text-[#52769b]">Labels</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.labels_tags.map((label) => (
                      <span
                        key={label}
                        className="px-2 py-1 rounded-full bg-[#FFDEE2]/50 text-[#52769b] text-sm"
                      >
                        {label.replace("en:", "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
