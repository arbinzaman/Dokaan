import { useEffect, useState } from "react";
import Quagga from "quagga";
import { Button } from "@mui/material";

const BarcodeScanner = ({ onScan, handleInputChange }) => {
  const [scannedBarcodes, setScannedBarcodes] = useState([]);

  // Play beep sound after scanning
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
        setScannedBarcodes((prev) => [...prev, scannedCode]);
        onScan(scannedCode);

        // 🔊 Play beep sound
        playBeep();

        // Stop scanning after detection
        Quagga.stop();
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <>
      <div className="flex">
        {/* Barcode Scanner Viewport */}
        <div id="interactive" className="viewport w-40 h-40 mr-4"></div>

        {/* Desktop View */}
        <div className="hidden sm:block col-span-full sm:col-span-1 relative">
          <Button onClick={() => Quagga.start()}>Re-Scan</Button>
          {scannedBarcodes.map((data, id) => (
            <input
              key={id}
              id="code"
              type="text"
              value={data}
              onChange={handleInputChange}
              className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2 mt-2"
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden col-span-full sm:col-span-1 relative mt-4">
        <Button onClick={() => Quagga.start()}>Re-Scan</Button>
        {scannedBarcodes.map((data, id) => (
          <input
            key={id}
            id="code"
            type="text"
            value={data}
            onChange={handleInputChange}
            className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2 mt-2"
          />
        ))}
      </div>
    </>
  );
};

export default BarcodeScanner;
