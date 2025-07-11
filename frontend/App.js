import React from "react";
import CameraCapture from "./CameraCapture";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>📸 Face Attendance Scanner</h1>
      <CameraCapture />
    </div>
  );
}

export default App;
