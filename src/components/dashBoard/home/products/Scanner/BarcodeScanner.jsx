import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@mui/material";

const BarcodeScanner = ({ onScan, handleInputChange }) => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const hasScannedRef = useRef(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const playBeep = () => {
    const beep = new Audio(`/audios/beep.mp3`);
    beep.play().catch((e) => console.error("Beep sound error:", e));
  };

  // Explicit environment facing constraints here:
  const videoConstraints = {
    video: {
      facingMode: { exact: "environment" }, // forces back camera
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  };

  const stopScanner = () => {
    if (codeReader.current) {
      try {
        if (typeof codeReader.current.stopContinuousDecode === "function") {
          codeReader.current.stopContinuousDecode();
        }
        if (typeof codeReader.current.reset === "function") {
          codeReader.current.reset();
        }
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }

      codeReader.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startScanner = () => {
    if (!videoRef.current) return;

    hasScannedRef.current = false;
    setIsScanning(true);

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .decodeFromConstraints(videoConstraints, videoRef.current, (result, err) => {
        if (result && !hasScannedRef.current) {
          const code = result.getText();
          hasScannedRef.current = true;
          setScannedBarcode(code);
          onScan(code);
          playBeep();
          stopScanner();
        }
        if (err && !(err instanceof DOMException)) {
          console.warn(err);
        }
      })
      .catch((err) => {
        console.error("ZXing start error:", err);
        setIsScanning(false);
      });
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  return (
    <div className="col-span-full sm:col-span-1">
      <label htmlFor="code" className="text-sm">
        Barcode (Scan or Type)
      </label>

      <div className="flex items-center gap-4">
        <video
          ref={videoRef}
          className="w-40 h-40 border rounded object-cover"
          muted
          autoPlay
          playsInline
        />

        <input
          id="code"
          type="text"
          value={scannedBarcode}
          onChange={(e) => {
            const val = e.target.value;
            setScannedBarcode(val);
            handleInputChange(e);
            onScan(val);
          }}
          placeholder="Scan or type barcode"
          className="flex-1 rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
        />
      </div>

      <Button
        onClick={() => {
          stopScanner();
          startScanner();
        }}
        className="mt-2"
        disabled={isScanning}
      >
        {isScanning ? "Scanning..." : "Re-Scan"}
      </Button>
    </div>
  );
};

export default BarcodeScanner;
