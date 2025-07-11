import React, { useRef } from "react";

function CameraCapture() {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not available.");
    }
  };

  return (
    <div>
      <video ref={videoRef} width="400" height="300" autoPlay style={{ border: "2px solid #ccc" }} />
      <br />
      <button onClick={startCamera} style={{ marginTop: "1rem" }}>Start Camera</button>
    </div>
  );
}

export default CameraCapture;
