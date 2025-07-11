// frontend/App.js

import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import axios from "axios";

function App() {
  const [recognized, setRecognized] = useState([]);
  const [batch, setBatch] = useState("batch1"); // You can update this dynamically later

  const handleUpload = async (imageBlob) => {
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("batch", batch);

    try {
      const response = await axios.post(
        `http://localhost:8000/upload/?batch=${batch}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setRecognized(response.data.recognized);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <h1>📸 Face Attendance App</h1>
      <CameraCapture onCapture={handleUpload} />

      <div>
        <h2>✅ Recognized Students</h2>
        {recognized.length === 0 ? (
          <p>No students recognized yet.</p>
        ) : (
          <ul>
            {recognized.map((regNo, index) => (
              <li key={index}>{regNo}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
