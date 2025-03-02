
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, XCircle, AlertCircle, ScanLine, ScanBarcode, Move, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkProductExists } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>();
  const [scanInstructions, setScanInstructions] = useState(t("scan_tip_3"));
  const [scanStatus, setScanStatus] = useState<"idle" | "searching" | "detected" | "reading">("idle");
  const [cameraLight, setCameraLight] = useState<"good" | "medium" | "low">("good");
  const [isBarcodeCentered, setIsBarcodeCentered] = useState(false);

  // Détection de la luminosité
  useEffect(() => {
    if (!isScanning || !videoRef.current) return;
    
    const checkLighting = () => {
      const video = videoRef.current;
      if (!video) return;
      
      // Création d'un canvas temporaire pour analyser la luminosité
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = video.videoWidth / 4;
      canvas.height = video.videoHeight / 4;
      
      try {
        // Dessiner une version réduite de la vidéo pour l'analyse
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculer la luminosité moyenne
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Formule de luminosité: 0.299R + 0.587G + 0.114B
          sum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        }
        const brightness = sum / (data.length / 4);
        
        // Classifier la luminosité
        if (brightness < 40) {
          setCameraLight("low");
          setScanInstructions("Éclairez mieux le code-barres");
        } else if (brightness < 100) {
          setCameraLight("medium");
          setScanInstructions("Améliorez l'éclairage si possible");
        } else {
          setCameraLight("good");
          setScanInstructions(t("scan_tip_3"));
        }
      } catch (err) {
        console.error("Erreur d'analyse de luminosité:", err);
      }
    };
    
    const lightingInterval = setInterval(checkLighting, 1000);
    return () => clearInterval(lightingInterval);
  }, [isScanning, t]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      setLastScannedCode(null);
      setScanStatus("idle");
      setIsBarcodeCentered(false);

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      await codeReader.decodeFromVideoDevice(
        undefined,
        'video-preview',
        async (result, err) => {
          if (result) {
            const barcode = result.getText();
            
            // Éviter de scanner plusieurs fois le même code en peu de temps
            if (barcode === lastScannedCode) {
              return;
            }
            
            // Mise à jour de l'état du scan
            setScanStatus("detected");
            setIsBarcodeCentered(true);
            setScanInstructions("Code-barres détecté!");
            setLastScannedCode(barcode);
            
            console.log("Code-barres détecté:", barcode);
            
            // Ajout d'une légère animation de succès
            setTimeout(() => {
              setScanStatus("reading");
              setScanInstructions(t("loading"));
            }, 300);
            
            try {
              const exists = await checkProductExists(barcode);
              if (exists) {
                // Confirmation visuelle avant navigation
                setScanInstructions("Produit trouvé!");
                setTimeout(() => {
                  stopScanning();
                  navigate(`/product/${barcode}`);
                }, 500);
              } else {
                setScanStatus("idle");
                setIsBarcodeCentered(false);
                toast({
                  title: t("product_not_found"),
                  description: t("product_not_found"),
                  variant: "destructive",
                });
                // Reset le dernier code scanné après un délai pour permettre de rescanner le même produit
                setTimeout(() => {
                  setLastScannedCode(null);
                  setScanInstructions(t("scan_tip_3"));
                }, 2000);
              }
            } catch (error) {
              setScanStatus("idle");
              setIsBarcodeCentered(false);
              console.error("Erreur lors de la vérification du produit:", error);
              toast({
                variant: "destructive",
                title: t("error"),
                description: t("error"),
              });
              setTimeout(() => {
                setLastScannedCode(null);
                setScanInstructions(t("scan_tip_3"));
              }, 2000);
            }
          }
          if (err && !(err instanceof TypeError)) {
            console.error("Erreur de scan:", err);
          }
        }
      );

    } catch (err) {
      console.error("Scanning error:", err);
      setIsScanning(false);
      setScanStatus("idle");
      setError(
        err instanceof Error 
          ? err.message 
          : t("error")
      );
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("error"),
      });
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = undefined;
    }

    if (videoRef.current?.srcObject instanceof MediaStream) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setScanStatus("idle");
  };

  // Rendu des instructions visuelles de scan
  const renderScanGuide = () => {
    return (
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Zone cible */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${scanStatus === "reading" ? "opacity-100" : "opacity-80"}`}>
          <div 
            className={`
              w-4/5 h-20 md:h-28 border-2 rounded-lg transition-all duration-300
              ${scanStatus === "idle" ? "border-gray-400" : 
                 scanStatus === "detected" ? "border-green-500 border-4 scale-105" : 
                 scanStatus === "reading" ? "border-brand-500 border-4 animate-pulse" : "border-brand-400"}
            `}
          >
            {/* Ligne de scan */}
            {scanStatus !== "detected" && (
              <div className="h-full relative overflow-hidden rounded-lg">
                <div className="absolute w-full h-0.5 bg-brand-500/80 left-0 animate-[scanline_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              </div>
            )}
          </div>
        </div>

        {/* Overlay informatif pour la luminosité */}
        {cameraLight === "low" && (
          <div className="absolute inset-0 bg-yellow-700/10 pointer-events-none" />
        )}

        {/* Indicateurs de guidage pour aider à centrer */}
        {!isBarcodeCentered && (
          <>
            <div className="absolute inset-x-0 top-1/4 flex justify-center">
              <Move className="w-6 h-6 text-white/60 animate-pulse" />
            </div>
            <div className="absolute inset-x-0 bottom-1/4 flex justify-center">
              <Maximize className="w-6 h-6 text-white/60 animate-pulse" />
            </div>
          </>
        )}

        {/* Instructions en temps réel */}
        <div className={`absolute inset-x-0 bottom-20 flex justify-center transition-all duration-300 ${scanStatus === "detected" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}`}>
          <div className={`
            px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium
            ${scanStatus === "detected" ? "bg-green-500/80 text-white" : 
              scanStatus === "reading" ? "bg-brand-500/80 text-white" : 
              cameraLight === "low" ? "bg-yellow-600/80 text-white" : "bg-gray-800/70 text-white"}
          `}>
            {scanInstructions}
          </div>
        </div>
      </div>
    );
  };

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
                <>
                  <video
                    id="video-preview"
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    autoPlay
                    muted
                  />
                  {renderScanGuide()}
                  <button
                    onClick={stopScanning}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
                  >
                    <XCircle className="h-6 w-6 text-brand-600" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <button
                    onClick={startScanning}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors mb-4"
                  >
                    <Camera className="h-5 w-5" />
                    <span>{t("activate_camera")}</span>
                  </button>
                  
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
                </div>
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
                <button
                  onClick={() => navigate("/search")}
                  className="text-brand-700 hover:underline"
                >
                  {t("search_button")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ajout de la keyframe pour l'animation de la ligne de scan
if (document.styleSheets.length > 0) {
  const styleSheet = document.styleSheets[0];
  try {
    styleSheet.insertRule(`
      @keyframes scanline {
        0% { top: 0; }
        50% { top: 100%; }
        50.1% { top: 0; }
        100% { top: 100%; }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    console.error("Impossible d'ajouter la règle CSS pour l'animation de scan:", e);
  }
}

export default Scan;
