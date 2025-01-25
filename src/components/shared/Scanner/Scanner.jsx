// src/components/Scanner.js
import  { useState, useRef, useEffect } from "react";
import Quagga from "quagga";

const Scanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Ref to store the media stream for proper cleanup
  const quaggaInitialized = useRef(false); // Track if Quagga has been initialized

  useEffect(() => {
    // Initialize scanner on mount
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning(); // Clean up when the component is unmounted
    };
  }, [isScanning]);

  const startScanning = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream; // Save the stream reference for cleanup
        }

        // Initialize Quagga only once
        if (!quaggaInitialized.current) {
          Quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
              },
              decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_13_reader", "upc_reader"], // Add other formats if necessary
              },
            },
            (err) => {
              if (err) {
                console.error("Error initializing Quagga:", err);
              } else {
                quaggaInitialized.current = true; // Mark as initialized
                Quagga.start();
                Quagga.onDetected(handleBarcodeScan);
              }
            }
          );
        }

        videoRef.current.play();
      });
    }
  };

  const stopScanning = () => {
    if (quaggaInitialized.current) {
      Quagga.stop();
      quaggaInitialized.current = false; // Reset initialized flag
    }

    if (streamRef.current) {
      // Properly stop the video stream tracks
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null; // Clear the stream reference
    }
  };

  const handleBarcodeScan = (result) => {
    setScannedResult(result.codeResult.code);
    onScan(result.codeResult.code);
  };

  return (
    <div>
      <video ref={videoRef} width="100%" height="100%" style={{ maxHeight: "400px", position: "relative" }} />
      {scannedResult && (
        <div className="scan-result">
          <p>Scanned Result: {scannedResult}</p>
        </div>
      )}
      {!isScanning ? (
        <button onClick={() => setIsScanning(true)}>Start Scanning</button>
      ) : (
        <button onClick={() => setIsScanning(false)}>Stop Scanning</button>
      )}
    </div>
  );
};

export default Scanner;
