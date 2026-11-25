import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, CameraOff, Search } from "lucide-react";

const BarcodeScanner = ({ value = "", onScan, handleInputChange }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const mountedRef = useRef(true);
  const hasScannedRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const playBeep = () => {
    try {
      const beep = new Audio("/audios/beep.mp3");
      beep.play().catch(() => {});
    } catch {
      // ignore audio errors
    }
  };

  const stopScanner = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {
        // ignore cleanup errors
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
    hasScannedRef.current = false;
    setIsScanning(true);

    const reader = new BrowserMultiFormatReader();
    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };

    try {
      const controls = await reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result) => {
          if (result && !hasScannedRef.current) {
            const code = result.getText();
            hasScannedRef.current = true;
            playBeep();
            onScan?.(code);
            stopScanner();
          }
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
          "Camera unavailable or permission denied. You can type the barcode manually."
        );
      }
    }
  }, [onScan, stopScanner]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="space-y-2">
      <label
        htmlFor="code"
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Barcode (Scan or Type)
      </label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          id="code"
          type="text"
          value={value}
          onChange={(e) => handleInputChange?.(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              e.preventDefault();
              onScan?.(value.trim());
            }
          }}
          placeholder="Scan or type barcode"
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => value.trim() && onScan?.(value.trim())}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium"
          >
            <Search size={16} />
            Lookup
          </button>

          <button
            type="button"
            onClick={isScanning ? stopScanner : startScanner}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isScanning
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isScanning ? <CameraOff size={16} /> : <Camera size={16} />}
            {isScanning ? "Stop Camera" : "Scan"}
          </button>
        </div>
      </div>

      {cameraError && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {cameraError}
        </p>
      )}

      <div className={isScanning ? "mt-2" : "hidden"}>
        <video
          ref={videoRef}
          className="w-full max-w-xs h-44 border border-gray-300 dark:border-gray-700 rounded-xl object-cover bg-black"
          muted
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};

export default BarcodeScanner;
