
import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { checkProductExists } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

export const useBarcodeScanner = () => {
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

  return {
    videoRef,
    isScanning,
    error,
    scanInstructions,
    scanStatus,
    cameraLight,
    isBarcodeCentered,
    startScanning,
    stopScanning
  };
};
