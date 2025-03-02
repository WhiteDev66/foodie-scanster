
import React from "react";
import { Move, Maximize, ScanLine } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface ScanGuideProps {
  scanStatus: "idle" | "searching" | "detected" | "reading";
  scanInstructions: string;
  cameraLight: "good" | "medium" | "low";
  isBarcodeCentered: boolean;
}

const ScanGuide = ({ 
  scanStatus, 
  scanInstructions, 
  cameraLight, 
  isBarcodeCentered 
}: ScanGuideProps) => {
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

export default ScanGuide;
