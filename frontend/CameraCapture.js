import React, { useRef, useEffect, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognized, setRecognized] = useState([]);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start frame capture every 2 seconds
      intervalRef.current = setInterval(captureAndSend, 2000);
    });

    return () => {
      clearInterval(intervalRef.current);
      let tracks = videoRef.current?.srcObject?.getTracks();
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
      formData.append("frame", blob);

      fetch("http://localhost:8000/match_faces/", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.matched) {
            setRecognized((prev) => [...new Set([...prev, ...data.matched])]);
          }
        });
    }, "image/jpeg");
  };

  const handleFinish = () => {
    clearInterval(intervalRef.current);
    setFinished(true);
  };

  return (
    <div>
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
};

export default CameraCapture;
