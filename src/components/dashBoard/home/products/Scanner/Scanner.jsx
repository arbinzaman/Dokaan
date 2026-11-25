import { useEffect, useState } from "react";
import Quagga from "quagga";

const Scanner = () => {
  const [refresh, setRefresh] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;
    setErrorMsg("");

    const handleDetected = (data) => {
      const code = data?.codeResult?.code;
      if (!code) return;
      setScannedBarcodes((prev) => [...prev, code]);
      try {
        Quagga.stop();
      } catch {
        // ignore
      }
    };

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.querySelector("#interactive"),
          constraints: {
            width: 640,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: false,
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        decoder: {
          readers: ["ean_reader", "code_128_reader"],
          multiple: false,
        },
        locate: true,
      },
      (err) => {
        if (!active) return;
        if (err) {
          setErrorMsg("Camera could not be initialized.");
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetected);

    return () => {
      active = false;
      try {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      } catch {
        // ignore
      }
    };
  }, [refresh]);

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
        <div
          id="interactive"
          className="viewport w-full min-h-[260px] rounded-xl overflow-hidden bg-black"
        />
        {errorMsg && (
          <p className="text-xs text-amber-500 mt-2">{errorMsg}</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scanned Barcodes
          </h2>
          <button
            type="button"
            onClick={() => setRefresh((prev) => !prev)}
            className="px-3.5 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Re-Scan
          </button>
        </div>

        {scannedBarcodes.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Point the camera at a barcode to scan.
          </p>
        ) : (
          <ul className="space-y-2">
            {scannedBarcodes.map((code, id) => (
              <li
                key={`${code}-${id}`}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 text-sm font-mono"
              >
                #{id + 1} — {code}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Scanner;
