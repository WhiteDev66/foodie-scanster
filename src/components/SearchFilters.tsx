
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "@/types/api";
import { X } from "lucide-react";

interface SearchFiltersProps {
  filters: Partial<SearchParams>;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onClearFilters: () => void;
  categories?: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  onFilterChange,
  onClearFilters,
  categories = []
}) => {
  const { t } = useTranslation();

  const handleNutriscoreChange = (value: string) => {
    onFilterChange({ ...filters, nutriscoreGrade: value });
  };

  const handleNovaGroupChange = (value: string) => {
    onFilterChange({ ...filters, novaGroup: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value });
  };

  const hasActiveFilters = !!filters.nutriscoreGrade || !!filters.novaGroup || !!filters.category;

  // Get unique categories and sort them alphabetically
  const uniqueCategories = [...new Set(categories)]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-brand-800">{t("search.filters.title", "Filters")}</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs flex items-center gap-1 h-7 px-2"
          >
            <X className="h-3 w-3" />
            {t("search.filters.clear", "Clear filters")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-sm text-brand-600">
            {t("search.filters.nutriscore", "Nutriscore")}
          </label>
          <Select 
            value={filters.nutriscoreGrade || ""}
            onValueChange={handleNutriscoreChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("search.filters.any", "Any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t("search.filters.any", "Any")}
              </SelectItem>
              <SelectItem value="a">A</SelectItem>
              <SelectItem value="b">B</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="d">D</SelectItem>
              <SelectItem value="e">E</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-brand-600">
            {t("search.filters.novaGroup", "NOVA Group")}
          </label>
          <Select 
            value={filters.novaGroup || ""}
            onValueChange={handleNovaGroupChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("search.filters.any", "Any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t("search.filters.any", "Any")}
              </SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {uniqueCategories.length > 0 && (
          <div className="space-y-1">
            <label className="text-sm text-brand-600">
              {t("search.filters.category", "Category")}
            </label>
            <Select 
              value={filters.category || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("search.filters.any", "Any")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("search.filters.any", "Any")}
                </SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
