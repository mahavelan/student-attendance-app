import React, { useRef, useState } from "react";

function CameraCapture() {
  const videoRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");
    setCaptured(imageData);

    // Send image to backend
    fetch("http://localhost:8000/face-recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    })
      .then((res) => res.json())
      .then((data) => alert("🧠 Response: " + JSON.stringify(data)))
      .catch((err) => alert("Error sending image to backend."));
  };

  return (
    <div>
      <button onClick={startCamera}>🎥 Start Camera</button>
      <div>
        <video ref={videoRef} autoPlay width="400" height="300" />
      </div>
      <button onClick={capture}>📸 Capture & Send</button>
      {captured && <img src={captured} alt="Captured" width="200" />}
    </div>
  );
}

export default CameraCapture;
