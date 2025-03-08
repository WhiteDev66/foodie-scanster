
import React from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/api";

interface RecentSearchesProps {
  recentSearches: Product[];
  onProductClick: (product: Product) => void;
  onSeeAllClick: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onProductClick,
  onSeeAllClick,
}) => {
  const { t } = useTranslation();

  if (recentSearches.length === 0) {
    return null;
  }

  const getNutriscore = (product: Product) => {
    if (!product.nutriscore_grade) {
      return t("search.nutriscore.notAvailable", "Non disponible");
    }
    return `${t("search.nutriscore.label", "Nutriscore")} : ${product.nutriscore_grade.toUpperCase()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-md font-medium text-gray-700 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          {t("search.recentSearches", "Recent searches")}
        </h2>
        <Button 
          variant="link" 
          size="sm" 
          onClick={onSeeAllClick}
          className="text-sm"
        >
          {t("search.seeAll", "See all")}
        </Button>
      </div>
      <div className="space-y-3">
        {recentSearches.map((product) => (
          <Link
            key={`${product.code}`}
            to={`/product/${product.code}`}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 card-hover"
            onClick={() => onProductClick(product)}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="h-12 w-12 object-contain rounded"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-medium text-brand-800">
                {product.product_name || t("search.unknownName", "Nom inconnu")}
              </h2>
              <span className="text-sm text-brand-600">
                {getNutriscore(product)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
