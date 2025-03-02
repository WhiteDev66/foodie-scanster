
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface AllergensInfoProps {
  allergens: string | undefined;
}

const AllergensInfo = ({ allergens }: AllergensInfoProps) => {
  const { t } = useLanguage();
  
  if (!allergens) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-red-700 mb-2">{t("allergens")}</h2>
      <p className="text-red-600">{allergens}</p>
    </div>
  );
};

export default AllergensInfo;
