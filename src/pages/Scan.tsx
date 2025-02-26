
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { checkProductExists } from "../services/api";

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;
      } catch (err) {
        console.error("Scanner initialization error:", err);
        setError("Erreur d'initialisation du scanner");
      }
    };

    initializeScanner();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      console.log("Starting scan...");
      setError(null);
      setIsScanning(true);

      if (!videoRef.current) {
        throw new Error("Référence vidéo non initialisée");
      }

      const constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // Tentative d'obtention des permissions de la caméra
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      if (!codeReaderRef.current) {
        throw new Error("Scanner non initialisé");
      }

      // Initialisation du scanner une fois que la vidéo est prête
      videoRef.current.onloadedmetadata = async () => {
        try {
          await codeReaderRef.current.decodeFromVideoDevice(
            null, // Utilise la caméra par défaut
            videoRef.current!,
            async (result, err) => {
              if (result) {
                const barcode = result.getText();
                console.log("Code-barres détecté:", barcode);
                
                try {
                  const exists = await checkProductExists(barcode);
                  if (exists) {
                    stopScanning();
                    navigate(`/product/${barcode}`);
                  } else {
                    toast({
                      title: "Produit non trouvé",
                      description: "Ce produit n'existe pas dans la base de données.",
                      variant: "destructive",
                    });
                  }
                } catch (error) {
                  console.error("Erreur lors de la vérification du produit:", error);
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de vérifier le produit. Veuillez réessayer.",
                  });
                }
              }
              if (err && !(err instanceof TypeError)) {
                console.error("Erreur de scan:", err);
              }
            }
          );
        } catch (error) {
          console.error("Erreur d'initialisation du scanner:", error);
          setError("Impossible d'initialiser le scanner");
        }
      };
    } catch (err) {
      console.error("Scanning error:", err);
      setIsScanning(false);
      setError(
        err instanceof Error 
          ? err.message 
          : "Impossible d'accéder à la caméra. Vérifiez vos permissions."
      );
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder à la caméra. Vérifiez vos permissions.",
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-brand-800 mb-2">
                Scanner un code-barres
              </h1>
              <p className="text-brand-600 mb-6">
                Placez le code-barres du produit face à votre caméra
              </p>
            </div>

            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    autoPlay
                    muted
                  />
                  <button
                    onClick={stopScanning}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                  >
                    <XCircle className="h-6 w-6 text-brand-600" />
                  </button>
                  <div className="absolute inset-0 border-2 border-brand-500/50 z-10">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-brand-500/50 animate-pulse" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={startScanning}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Activer la caméra</span>
                  </button>
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
                Ou{" "}
                <button
                  onClick={() => navigate("/search")}
                  className="text-brand-700 hover:underline"
                >
                  recherchez manuellement un produit
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
