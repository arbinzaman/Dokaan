import { useEffect, useState } from "react";
import Quagga from "quagga";
import { Button } from "@mui/material";

const BarcodeScanner = ({ onScan, handleInputChange }) => {
  const [scannedBarcode, setScannedBarcode] = useState("");

  const playBeep = () => {
    const beep = new Audio(`/audios/beep.mp3`);
    beep.play().catch((error) => console.error("Error playing sound:", error));
  };

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 800,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "large",
          halfSample: false,
        },
        numOfWorkers: navigator.hardwareConcurrency,
        decoder: {
          readers: ["ean_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      const scannedCode = data.codeResult.code;
      if (scannedCode) {
        setScannedBarcode(scannedCode);
        onScan(scannedCode);
        playBeep();
        Quagga.stop();
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <div className="col-span-full sm:col-span-1">
      <label htmlFor="code" className="text-sm">
        Barcode (Scan or Type)
      </label>

      <div className="flex items-center gap-4">
        {/* Scanner View */}
        <div id="interactive" className="viewport w-40 h-40 border rounded" />

        {/* Manual Input */}
        <input
          id="code"
          type="text"
          value={scannedBarcode}
          onChange={(e) => {
            setScannedBarcode(e.target.value);
            handleInputChange(e);
            onScan(e.target.value);
          }}
          placeholder="Scan or type barcode"
          className="flex-1 rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
        />
      </div>

      <Button onClick={() => Quagga.start()} className="mt-2">
        Re-Scan
      </Button>
    </div>
  );
};

export default BarcodeScanner;
