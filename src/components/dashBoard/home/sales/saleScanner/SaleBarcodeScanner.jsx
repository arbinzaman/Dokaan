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
            height: 600,
            facingMode: "environment",
          },
          area: {
            // crop image to focus center
            top: "25%",
            right: "25%",
            left: "25%",
            bottom: "25%",
          },
          singleChannel: false,
        },
        frequency: 10, // try 5–15

        locator: {
          patchSize: "x-large", // better for distant barcodes
          halfSample: true, // speeds up and improves performance
        },

        numOfWorkers: navigator.hardwareConcurrency,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "i2of5_reader",
            "i2of5_reader",
            "code_93_reader"

          ],
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

    let lastScannedCode = null;

    Quagga.onDetected((data) => {
      const code = data.codeResult.code;

      const errors = data.codeResult.decodedCodes
        .map((d) => d.error)
        .filter((e) => e !== undefined);

      const averageError = errors.reduce((a, b) => a + b, 0) / errors.length;

      // Filter out weak scans (adjust threshold as needed)
      if (code && averageError < 0.25 && code !== lastScannedCode) {
        lastScannedCode = code;
        setScannedCode(code);
        onScan({ barcode: code });
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
            className="w-full rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2 mt-2"
          />
        )}
      </div>
    </>
  );
};

export default SaleBarcodeScanner;
