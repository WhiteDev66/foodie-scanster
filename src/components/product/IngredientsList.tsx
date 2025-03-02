
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface IngredientsListProps {
  ingredientsText: string | undefined;
}

const IngredientsList = ({ ingredientsText }: IngredientsListProps) => {
  const { t } = useLanguage();
  
  if (!ingredientsText) return null;
  
  return (
    <div className="bg-white/80 rounded-lg shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{t("ingredients")}</h2>
      <p className="text-gray-700 text-sm">{ingredientsText}</p>
    </div>
  );
};

export default IngredientsList;
