
import React from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onQueryChange,
  onToggleFilters,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm p-4">
      <SearchIcon className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={onQueryChange}
        placeholder={t("search.placeholder", "Rechercher un produit...")}
        className="flex-1 outline-none"
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleFilters} 
        className={hasActiveFilters ? "text-brand-600" : "text-gray-400"}
      >
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchInput;
