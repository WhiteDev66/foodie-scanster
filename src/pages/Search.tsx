
import { Search as SearchIcon, Clock, History as HistoryIcon, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/api";
import { Product, SearchParams } from "../types/api";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import MobileHeader from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { getHistory, addToHistory } from "@/services/storage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchFilters from "@/components/SearchFilters";

const Search = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchParams>>({});
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Load recent history
  useEffect(() => {
    const history = getHistory().slice(0, 5);
    setRecentSearches(history);
  }, []);

  // Force refetch when language changes
  useEffect(() => {
    if (debouncedQuery) {
      // Refetch search results when language changes
      refetch().catch(error => {
        console.error("Error refetching search results:", error);
      });
    }
  }, [i18n.language, debouncedQuery]);

  const searchParams: SearchParams = {
    query: debouncedQuery,
    ...filters
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search", debouncedQuery, filters, i18n.language],
    queryFn: () => searchProducts(debouncedQuery ? searchParams : ""),
    enabled: debouncedQuery.length > 0,
    retry: false,
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: t("search.error.title", "Erreur"),
          description: t("search.error.description", "Impossible de charger les résultats. Veuillez réessayer."),
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

  const handleProductClick = (product: Product) => {
    // Add product to history when clicked
    addToHistory(product);
  };

  const handleFilterChange = (newFilters: Partial<SearchParams>) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const getNutriscore = (product: Product) => {
    if (!product.nutriscore_grade) {
      return t("search.nutriscore.notAvailable", "Non disponible");
    }
    return `${t("search.nutriscore.label", "Nutriscore")} : ${product.nutriscore_grade.toUpperCase()}`;
  };

  const hasActiveFilters = Object.values(filters).some(value => !!value);

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileHeader /> : null}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {!isMobile && (
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
          )}
          
          <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm p-4">
            <SearchIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={t("search.placeholder", "Rechercher un produit...")}
              className="flex-1 outline-none"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFilters} 
              className={hasActiveFilters ? "text-brand-600" : "text-gray-400"}
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {showFilters && (
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-pulse">{t("search.loading", "Chargement...")}</div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600">
              {t("search.error.message", "Une erreur est survenue lors de la recherche.")}
            </div>
          )}

          {!debouncedQuery && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-md font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {t("search.recentSearches", "Recent searches")}
                </h2>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate("/history")}
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
                    onClick={() => handleProductClick(product)}
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
          )}

          <div className="grid gap-4">
            {data?.products?.map((product: Product) => (
              <Link
                key={product.code}
                to={`/product/${product.code}`}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 card-hover"
                onClick={() => handleProductClick(product)}
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
            
            {data?.products?.length === 0 && debouncedQuery && (
              <div className="text-center py-4 text-gray-500">
                {t("search.noResults", 'Aucun produit trouvé pour "{query}"', { query: debouncedQuery })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
