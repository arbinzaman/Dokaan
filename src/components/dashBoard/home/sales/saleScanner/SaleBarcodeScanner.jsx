import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, CameraOff } from "lucide-react";

const SaleBarcodeScanner = ({ onScan, setManualCodeInput }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const mountedRef = useRef(true);
  const lastScanRef = useRef({ code: "", time: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const playBeep = () => {
    try {
      const beep = new Audio("/audios/beep.mp3");
      beep.play().catch(() => {});
    } catch {
      // ignore
    }
  };

  const stopScanner = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {
        // ignore
      }
      controlsRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!videoRef.current) return;
    stopScanner();
    setCameraError("");
    setIsScanning(true);

    const codeReader = new BrowserMultiFormatReader();
    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };

    try {
      const controls = await codeReader.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result) => {
          if (!result) return;
          const code = result.getText();
          const now = Date.now();
          // 1.5s cooldown prevents rapid duplicate triggers of the same barcode
          if (
            lastScanRef.current.code === code &&
            now - lastScanRef.current.time < 1500
          ) {
            return;
          }
          lastScanRef.current = { code, time: now };
          playBeep();
          setManualCodeInput?.(code);
          onScan?.({ code });
        }
      );

      if (!mountedRef.current) {
        controls.stop();
        return;
      }
      controlsRef.current = controls;
    } catch {
      if (mountedRef.current) {
        setIsScanning(false);
        setCameraError(
          "Camera unavailable or permission denied. Use manual barcode entry below."
        );
      }
    }
  }, [onScan, setManualCodeInput, stopScanner]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <button
        type="button"
        onClick={() => (isScanning ? stopScanner() : startScanner())}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
          isScanning
            ? "bg-rose-600 hover:bg-rose-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
        {isScanning ? "Stop Camera Scanner" : "Start Camera Scanner"}
      </button>

      {cameraError && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {cameraError}
        </p>
      )}

      <video
        ref={videoRef}
        className={`w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-black ${
          isScanning ? "block" : "hidden"
        }`}
        muted
        autoPlay
        playsInline
      />
    </div>
  );
};

export default SaleBarcodeScanner;
