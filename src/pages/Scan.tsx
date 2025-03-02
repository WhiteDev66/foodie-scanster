
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import ScanCamera from "../components/scan/ScanCamera";
import ScanActivator from "../components/scan/ScanActivator";
import { useEffect } from "react";
import { addScanLineKeyframe } from "../utils/scanCss";

const Scan = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const {
    videoRef,
    isScanning,
    error,
    scanInstructions,
    scanStatus,
    cameraLight,
    isBarcodeCentered,
    startScanning,
    stopScanning
  } = useBarcodeScanner();
  
  // Add scanline keyframe animation
  useEffect(() => {
    addScanLineKeyframe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-brand-800 mb-2">
                {t("scan_page_title")}
              </h1>
              <p className="text-brand-600 mb-6">
                {t("scan_page_subtitle")}
              </p>
            </div>

            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {isScanning ? (
                <ScanCamera 
                  videoRef={videoRef}
                  scanStatus={scanStatus}
                  scanInstructions={scanInstructions}
                  cameraLight={cameraLight}
                  isBarcodeCentered={isBarcodeCentered}
                  onStopScanning={stopScanning}
                />
              ) : (
                <ScanActivator onStartScanning={startScanning} />
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="text-center text-brand-600">
              <p className="text-sm">
                {t("or_search")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-brand-700"
                  onClick={() => navigate("/search")}
                >
                  {t("search_button")}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
