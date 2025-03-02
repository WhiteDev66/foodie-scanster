
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/api";
import { Product } from "../types/api";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "../contexts/LanguageContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    retry: false,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("error"),
        });
      }
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const getNutriscore = (product: Product) => {
    if (!product.nutriscore_grade) {
      return t("not_available");
    }
    return `${t("nutriscore")} : ${product.nutriscore_grade.toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm p-4">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={t("search_placeholder")}
              className="flex-1 outline-none"
            />
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-pulse">{t("loading")}</div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600">
              {t("error")}
            </div>
          )}

          <div className="grid gap-4">
            {data?.products?.map((product: Product) => (
              <Link
                key={product.code}
                to={`/product/${product.code}`}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 card-hover"
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
                    {product.product_name || t("unknown_name")}
                  </h2>
                  <span className="text-sm text-brand-600">
                    {getNutriscore(product)}
                  </span>
                </div>
              </Link>
            ))}
            
            {data?.products?.length === 0 && debouncedQuery && (
              <div className="text-center py-4 text-gray-500">
                {t("product_not_found")} "{debouncedQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
