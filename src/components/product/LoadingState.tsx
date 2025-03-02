
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto">
        {/* Product image skeleton */}
        <Skeleton className="h-64 w-full mb-4" />
        
        {/* Product title skeleton */}
        <Skeleton className="h-8 w-3/4 mb-2" />
        
        {/* Product brand skeleton */}
        <Skeleton className="h-6 w-1/2 mb-6" />
        
        {/* Nutrition score skeleton */}
        <Skeleton className="h-12 w-full mb-4" />
        
        {/* Nova group skeleton */}
        <Skeleton className="h-12 w-full mb-4" />
        
        {/* Nutrition info skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        
        {/* Ingredients skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        
        {/* Loading text */}
        <p className="text-center text-gray-600 mt-4">{t("loading")}</p>
      </div>
    </div>
  );
};

export default LoadingState;
