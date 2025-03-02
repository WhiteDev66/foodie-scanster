
import React, { useRef, useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import ScanGuide from "./ScanGuide";

interface ScanCameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  scanStatus: "idle" | "searching" | "detected" | "reading";
  scanInstructions: string;
  cameraLight: "good" | "medium" | "low";
  isBarcodeCentered: boolean;
  onStopScanning: () => void;
}

const ScanCamera = ({
  videoRef,
  scanStatus,
  scanInstructions,
  cameraLight,
  isBarcodeCentered,
  onStopScanning
}: ScanCameraProps) => {
  return (
    <>
      <video
        id="video-preview"
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        autoPlay
        muted
      />
      <ScanGuide 
        scanStatus={scanStatus}
        scanInstructions={scanInstructions}
        cameraLight={cameraLight}
        isBarcodeCentered={isBarcodeCentered}
      />
      <button
        onClick={onStopScanning}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
      >
        <XCircle className="h-6 w-6 text-brand-600" />
      </button>
    </>
  );
};

export default ScanCamera;
