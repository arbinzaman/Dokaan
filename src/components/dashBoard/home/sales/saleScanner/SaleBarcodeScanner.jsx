import { useEffect, useState } from "react";
import Quagga from "quagga";
import { Button } from "@mui/material";

const SaleBarcodeScanner = ({ onScan }) => {
  const [scannedCode, setScannedCode] = useState("");

  const playBeep = () => {
    const beep = new Audio("/audios/beep.mp3");
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
      const code = data.codeResult.code;
      if (code) {
        setScannedCode(code);
        onScan({ barcode: code }); // Send object with barcode key
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
    <>
      <div className="flex">
        <div id="interactive" className="viewport w-40 h-40 mr-4"></div>

        <div className="hidden sm:block">
          <Button onClick={() => Quagga.start()}>Re-Scan</Button>
          {scannedCode && (
            <input
              type="text"
              value={scannedCode}
              readOnly
              className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2 mt-2"
            />
          )}
        </div>
      </div>

      <div className="block sm:hidden mt-4">
        <Button onClick={() => Quagga.start()}>Re-Scan</Button>
        {scannedCode && (
          <input
            type="text"
            value={scannedCode}
            readOnly
            className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2 mt-2"
          />
        )}
      </div>
    </>
  );
};

export default SaleBarcodeScanner;
