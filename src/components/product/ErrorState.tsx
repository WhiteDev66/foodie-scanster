
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const ErrorState = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Error icon */}
        <CircleAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        
        {/* Error message */}
        <p className="text-red-600 text-lg font-medium mb-6">{t("error")}</p>
        
        {/* Product content skeletons that failed to load */}
        <div className="mb-8 opacity-40">
          <Skeleton className="h-48 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/3 mx-auto mb-6" />
          
          <div className="space-y-2 mb-4 max-w-sm mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
        
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mx-auto"
        >
          {t("back")}
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
