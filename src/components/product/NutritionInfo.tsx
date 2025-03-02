
import React from "react";
import NutritionValue from "./NutritionValue";
import { useLanguage } from "../../contexts/LanguageContext";

interface NutritionInfoProps {
  product: any;
}

const NutritionInfo = ({ product }: NutritionInfoProps) => {
  const { t } = useLanguage();
  
  if (!product || !product.nutriments) return null;
  
  return (
    <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">{t("nutrition_info")}</h2>
      <div className="space-y-2">
        <NutritionValue label={t("energy")} value={product.nutriments.energy} unit="kJ" />
        <NutritionValue label={t("fat")} value={product.nutriments.fat} />
        <NutritionValue label={t("saturated_fat")} value={product.nutriments["saturated-fat"]} />
        <NutritionValue label={t("carbohydrates")} value={product.nutriments.carbohydrates} />
        <NutritionValue label={t("sugars")} value={product.nutriments.sugars} />
        <NutritionValue label={t("fiber")} value={product.nutriments.fiber} />
        <NutritionValue label={t("proteins")} value={product.nutriments.proteins} />
        <NutritionValue label={t("salt")} value={product.nutriments.salt} />
      </div>
    </div>
  );
};

export default NutritionInfo;
