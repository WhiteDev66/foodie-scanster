
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { searchProducts } from "../services/api";
import { Product, SearchParams } from "../types/api";
import { getHistory, addToHistory } from "@/services/storage";

// Components
import MobileHeader from "@/components/MobileHeader";
import SearchFilters from "@/components/SearchFilters";
import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import RecentSearches from "@/components/RecentSearches";
import SearchHeader from "@/components/SearchHeader";

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

  const hasActiveFilters = Object.values(filters).some(value => !!value);
  
  // Extract categories from search results for filter
  const extractCategories = () => {
    if (!data?.products) return [];
    
    return data.products
      .flatMap(product => product.categories_tags || [])
      .map(category => {
        // Extract the category name from the tag (e.g., "en:category-name")
        const parts = category.split(":");
        return parts.length > 1 ? parts[1].replace(/-/g, " ") : category;
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileHeader /> : null}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {!isMobile && <SearchHeader />}
          
          <SearchInput
            query={query}
            onQueryChange={handleSearch}
            onToggleFilters={toggleFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {showFilters && (
            <SearchFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              categories={extractCategories()}
            />
          )}

          {!debouncedQuery && (
            <RecentSearches
              recentSearches={recentSearches}
              onProductClick={handleProductClick}
              onSeeAllClick={() => navigate("/history")}
            />
          )}

          <SearchResults
            data={data}
            isLoading={isLoading}
            error={error as Error | null}
            debouncedQuery={debouncedQuery}
            onProductClick={handleProductClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
