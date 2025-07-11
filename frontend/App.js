// frontend/App.js
import React, { useRef, useEffect, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognized, setRecognized] = useState([]);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const batch = "batch1"; // you can dynamically update this if needed

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      intervalRef.current = setInterval(captureAndSend, 2000);
    });

    return () => {
      clearInterval(intervalRef.current);
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  const captureAndSend = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("file", blob);

      fetch(`http://localhost:8000/upload/?batch=${batch}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.recognized?.length) {
            setRecognized((prev) => [...new Set([...prev, ...data.recognized])]);
          }
        })
        .catch((err) => console.error("❌ Upload failed:", err));
    }, "image/jpeg");
  };

  const handleFinish = () => {
    clearInterval(intervalRef.current);
    setFinished(true);
  };

  return (
    <div>
      <h1>📸 Face Attendance App</h1>
      <video ref={videoRef} autoPlay width="400" height="300" />
      <canvas ref={canvasRef} width="400" height="300" style={{ display: "none" }} />
      <br />
      <button onClick={handleFinish}>✅ Finish Attendance</button>

      {finished && (
        <div>
          <h3>🧑 Present Students:</h3>
          <ul>
            {recognized.map((reg, index) => (
              <li key={index}>{reg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
