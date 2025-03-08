
import React from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "@/types/api";

interface SearchResultsProps {
  data: {
    products?: Product[];
  } | undefined;
  isLoading: boolean;
  error: Error | null;
  debouncedQuery: string;
  onProductClick: (product: Product) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  data,
  isLoading,
  error,
  debouncedQuery,
  onProductClick,
}) => {
  const { t } = useTranslation();

  const getNutriscore = (product: Product) => {
    if (!product.nutriscore_grade) {
      return t("search.nutriscore.notAvailable", "Non disponible");
    }
    return `${t("search.nutriscore.label", "Nutriscore")} : ${product.nutriscore_grade.toUpperCase()}`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">{t("search.loading", "Chargement...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {t("search.error.message", "Une erreur est survenue lors de la recherche.")}
      </div>
    );
  }

  if (!data?.products || data.products.length === 0) {
    if (debouncedQuery) {
      return (
        <div className="text-center py-4 text-gray-500">
          {t("search.noResults", 'Aucun produit trouvé pour "{query}"', { query: debouncedQuery })}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid gap-4">
      {data.products.map((product: Product) => (
        <Link
          key={product.code}
          to={`/product/${product.code}`}
          className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 card-hover"
          onClick={() => onProductClick(product)}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              className="h-16 w-16 object-contain rounded"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
              <SearchIcon className="h-6 w-6 text-gray-400" />
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
  );
};

export default SearchResults;
