
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";

const SearchHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-brand-800">{t("search.title", "Recherche")}</h1>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/history")}
          className="flex items-center gap-2"
        >
          <HistoryIcon className="h-4 w-4" />
          {t("history.title", "History & Favorites")}
        </Button>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default SearchHeader;
