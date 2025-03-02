
import React from "react";
import { Camera } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import ScanTips from "./ScanTips";

interface ScanActivatorProps {
  onStartScanning: () => void;
}

const ScanActivator = ({ onStartScanning }: ScanActivatorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
      <button
        onClick={onStartScanning}
        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors mb-4"
      >
        <Camera className="h-5 w-5" />
        <span>{t("activate_camera")}</span>
      </button>
      
      <ScanTips />
    </div>
  );
};

export default ScanActivator;
