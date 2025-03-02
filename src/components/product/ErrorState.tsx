
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const ErrorState = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <CircleAlert className="h-12 w-12 text-red-500" />
      <p className="mt-4 text-red-600">{t("error")}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => navigate(-1)}
      >
        {t("back")}
      </Button>
    </div>
  );
};

export default ErrorState;
