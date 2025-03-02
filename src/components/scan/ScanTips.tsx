
import React from "react";
import { AlertCircle, ScanBarcode, ScanLine } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const ScanTips = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center text-gray-500 mt-4">
      <div className="flex flex-col items-center justify-center mb-2 space-y-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-brand-600" />
          <span>{t("scan_tip_1")}</span>
        </div>
        
        <div className="flex items-center">
          <ScanBarcode className="h-5 w-5 mr-2 text-brand-600" />
          <span>{t("scan_tip_2")}</span>
        </div>
        
        <div className="flex items-center">
          <ScanLine className="h-5 w-5 mr-2 text-brand-600" />
          <span>{t("scan_tip_3")}</span>
        </div>
      </div>
    </div>
  );
};

export default ScanTips;
