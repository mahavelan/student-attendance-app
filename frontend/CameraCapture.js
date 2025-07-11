import React, { useRef, useEffect } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay width="400" height="300" />
    </div>
  );
};

export default CameraCapture;
