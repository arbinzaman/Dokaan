import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@mui/material";

const SaleBarcodeScanner = ({ onScan, setManualCodeInput }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);

  const playBeep = () => {
    const beep = new Audio("/audios/beep.mp3");
    beep.play().catch(() => {});
  };

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      // Find back camera explicitly (environment-facing)
      const backCamera = devices.find((device) =>
        /back|rear|environment/i.test(device.label)
      );

      const selectedDeviceId = backCamera?.deviceId || devices[0]?.deviceId;

      if (!selectedDeviceId) {
        console.error("No camera found");
        setIsScanning(false);
        return;
      }

      hasScannedRef.current = false;
      setIsScanning(true);

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result && !hasScannedRef.current) {
            const code = result.getText();
            hasScannedRef.current = true;
            setManualCodeInput(code);
            onScan({ code });
            playBeep();
          }
          if (
            err &&
            !(err instanceof DOMException) &&
            !/NotFoundException/i.test(err.name || err.toString())
          ) {
            console.warn("ZXing error:", err);
          }
        }
      );
    } catch (error) {
      console.error("Scanner start error:", error);
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    try {
      if (codeReaderRef.current) {
        if (typeof codeReaderRef.current.reset === "function") {
          codeReaderRef.current.reset();
        }
        codeReaderRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    hasScannedRef.current = false;
  };

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
        muted
        autoPlay
        playsInline
      />
      <Button
        variant="outlined"
        className="mt-2"
        onClick={() => {
          if (isScanning) stopScanner();
          else startScanner();
        }}
      >
        {isScanning ? "Stop Scan" : "Start Scan"}
      </Button>
    </div>
  );
};

export default SaleBarcodeScanner;
