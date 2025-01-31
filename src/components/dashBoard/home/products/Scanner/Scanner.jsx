import  { useEffect, useState } from 'react';
import Quagga from 'quagga'; // Import Quagga library
import { Button } from '@mui/material';

const Scanner = () => {
  const [refresh, setRefresh] = useState(false);
  const [scannedBarcodes, setScanBarcodes] = useState([]);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          width: 800,
          // height: 480,
          facingMode: "environment" // or "user" for the front camera
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: false,
      },
      numOfWorkers: navigator.hardwareConcurrency,
      decoder: {
        readers: [
          "ean_reader"
        ],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true
        },
        multiple: false
      },
      locate: true,

      // "inputStream":{"type":"LiveStream","constraints":{"width":800,"height":600}},
      // "locator":{"patchSize":"medium","halfSample":false},
      // "numOfWorkers":8,
      // "frequency":10,
      // "decoder":{"readers":[{"format":"ean_reader","config":{"supplements":["ean_5_reader","ean_2_reader"]}}]},
      // "locate":true
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    // Detect barcode and output result
    Quagga.onDetected((data) => {
      setScanBarcodes(prevItems => [...prevItems, data]);
      console.log(data.codeResult.code); // Log barcode data
      Quagga.stop();
    });

    // Clean up
    return () => {
      Quagga.offDetected(); // Remove event listener
      Quagga.stop();        // Stop Quagga
    };
  }, [refresh]);

  // useEffect(() => {
  //   Quagga.decodeSingle({
  //     src: "./barcode.gif",
  //     numOfWorkers: 0,  // Needs to be 0 when decoding local files
  //     decoder: {
  //       readers: ["code_128_reader"] // Use the appropriate reader
  //     },
  //   }, function (result) {
  //     if (result.codeResult) {
  //       console.log("result", result.codeResult.code);
  //     } else {
  //       console.log("not detected");
  //     }
  //   });
  // }, []);

  const scan = () => {
    setRefresh(prev => !prev);
  }

  const upload = () => {

  }

  const generate = () => {

  }

  return (
    <div style={{ display: 'flex' }}>
      <div id="interactive" className="viewport" />
      <div style={{ width: '50%', backgroundColor: 'aliceblue' }}>
        <Button onClick={scan}>Re-Scan</Button>
        <Button onClick={upload}>Upload</Button>
        <Button onClick={generate}>Generate</Button>
        {scannedBarcodes.map((data, id) => (
          <p key={id} style={{ backgroundColor: 'cadetblue', padding: 10, borderRadius: 10 }}>Barcode #{id} - {data.codeResult.code}</p>
        ))}
      </div>
    </div>
  );
};

export default Scanner;
