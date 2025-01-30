import { useState, useRef, useEffect } from "react";
import Quagga from "quagga";

const Scanner = ({ onScan }) => {
  const [scannedResult, setScannedResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const quaggaInitialized = useRef(false);

  console.log("onScan prop received:", onScan);

  useEffect(() => {
    // Start scanning when the component mounts
    startScanning();

    // Cleanup resources when the component unmounts
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera API not supported by this browser.");
      alert("Your browser does not support camera access.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }

        // Initialize Quagga if not already initialized
        if (!quaggaInitialized.current) {
          Quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current, // Attach the video element
              },
              decoder: {
                readers: [
                  "code_128_reader",
                  "ean_reader",
                  "ean_13_reader",
                  "upc_reader",
                ], // Add more barcode formats if needed
              },
            },
            (err) => {
              if (err) {
                console.error("Error initializing Quagga:", err);
                alert("Failed to initialize barcode scanner. Please try again.");
              } else {
                quaggaInitialized.current = true;
                Quagga.start();
                Quagga.onDetected(handleBarcodeScan);
                console.log("Quagga initialized and scanning started.");
              }
            }
          );
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera:", err);
        if (err.name === "NotReadableError") {
          alert(
            "The camera is already in use by another application. Please close other apps or tabs using the camera."
          );
        } else if (err.name === "NotAllowedError") {
          alert(
            "Camera access was denied. Please enable camera permissions in your browser settings."
          );
        } else {
          alert("An error occurred while accessing the camera. Please try again.");
        }
      });
  };

  const stopScanning = () => {
    // Stop Quagga if it's running
    if (quaggaInitialized.current) {
      Quagga.stop();
      Quagga.offDetected(handleBarcodeScan);
      quaggaInitialized.current = false;
    }

    // Stop video stream to release the camera
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleBarcodeScan = (result) => {
    if (result?.codeResult?.code) {
      console.log("Detected barcode:", result.codeResult.code);
      setScannedResult(result.codeResult.code);
      onScan(result.codeResult.code); // Pass the scanned result to the parent component
      stopScanning(); // Stop scanning after a successful detection
    } else {
      console.log("No barcode detected or invalid format.");
    }
  };

  return (
    <div className="scanner-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        height="100%"
        style={{ maxHeight: "400px", borderRadius: "8px" }}
      />
      {scannedResult && (
        <div className="scan-result">
          <p>Scanned Result: {scannedResult}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
