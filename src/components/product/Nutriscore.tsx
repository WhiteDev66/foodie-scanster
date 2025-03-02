
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface NutriscoreProps {
  grade: string | undefined | null;
}

const Nutriscore = ({ grade }: NutriscoreProps) => {
  const { t } = useLanguage();
  if (!grade) return null;
  
  const getColor = (score: string) => {
    switch (score.toUpperCase()) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-lime-500';
      case 'C': return 'bg-yellow-400';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-medium">{t("nutriscore")}:</span>
      <div className={`${getColor(grade)} text-white font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
        {grade.toUpperCase()}
      </div>
    </div>
  );
};

export default Nutriscore;
