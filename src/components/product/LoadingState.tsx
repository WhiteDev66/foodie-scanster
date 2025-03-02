
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const LoadingState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">{t("loading")}</p>
    </div>
  );
};

export default LoadingState;
