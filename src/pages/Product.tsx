
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../contexts/LanguageContext";

// Import the new component files
import ProductHeader from "../components/product/ProductHeader";
import Nutriscore from "../components/product/Nutriscore";
import NovaGroup from "../components/product/NovaGroup";
import HealthAssessment from "../components/product/HealthAssessment";
import NutritionInfo from "../components/product/NutritionInfo";
import IngredientsList from "../components/product/IngredientsList";
import AllergensInfo from "../components/product/AllergensInfo";
import LoadingState from "../components/product/LoadingState";
import ErrorState from "../components/product/ErrorState";

const Product = () => {
  const { barcode } = useParams();
  const { t } = useLanguage();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", barcode],
    queryFn: async () => {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error(t("unknown_product"));
      }
      const data = await response.json();
      return data.product;
    },
  });
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <ProductHeader product={product} />
      
      {/* Health Assessment */}
      <HealthAssessment product={product} />
      
      {/* Nutriscore */}
      {product?.nutriscore_grade && (
        <Nutriscore grade={product.nutriscore_grade} />
      )}
      
      {/* Nova Group */}
      {product?.nova_group && (
        <NovaGroup group={product.nova_group} />
      )}
      
      {/* Nutrition Information */}
      <NutritionInfo product={product} />
      
      {/* Ingredients */}
      <IngredientsList ingredientsText={product?.ingredients_text} />
      
      {/* Allergens */}
      <AllergensInfo allergens={product?.allergens} />
    </div>
  );
};

export default Product;
