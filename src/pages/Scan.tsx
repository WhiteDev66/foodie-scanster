
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import { Camera, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      if (!codeReaderRef.current || !videoRef.current) return;

      const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error("Aucune caméra détectée");
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result: Result | null, error?: Error) => {
          if (result) {
            codeReaderRef.current?.reset();
            setIsScanning(false);
            navigate(`/product/${result.getText()}`);
          }
          if (error && !(error instanceof TypeError)) {
            // TypeError est lancé quand le scan est arrêté normalement
            console.error("Erreur de scan:", error);
          }
        }
      );
    } catch (err) {
      setIsScanning(false);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder à la caméra. Vérifiez vos permissions.",
      });
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setIsScanning(false);
    }
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

            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={stopScanning}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <XCircle className="h-6 w-6 text-brand-600" />
                  </button>
                  <div className="absolute inset-0 border-2 border-brand-500/50">
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
