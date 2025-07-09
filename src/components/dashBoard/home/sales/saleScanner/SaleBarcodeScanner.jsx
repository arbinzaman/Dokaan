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
            top: "25%",
            right: "25%",
            left: "25%",
            bottom: "25%",
          },
          singleChannel: false,
        },
        frequency: 10,
        locator: {
          patchSize: "x-large",
          halfSample: true,
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
            "code_93_reader",
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
      const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;

      if (code && avgError < 0.25 && code !== lastScannedCode) {
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

  const handleManualInput = (e) => {
    const inputValue = e.target.value;
    setScannedCode(inputValue);
    if (inputValue.length > 5) {
      onScan({ barcode: inputValue });
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-4">
      <div id="interactive" className="viewport w-full md:w-1/2 h-48 bg-black rounded"></div>

      <div className="w-full md:w-1/2">
        <Button onClick={() => Quagga.start()} variant="outlined">
          Re-Scan
        </Button>
        <input
          type="text"
          placeholder="Enter barcode manually"
          value={scannedCode}
          onChange={handleManualInput}
          className="w-full mt-2 rounded-md border border-red-400 dark:border-gray-700 dark:text-white text-black bg-white dark:bg-black p-2"
        />
      </div>
    </div>
  );
};

export default SaleBarcodeScanner;
