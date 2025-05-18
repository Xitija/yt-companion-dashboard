import { use, useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { VideoDetails } from "./components/VideoDetails";
import { VideoNotes } from "./components/VideoNotes";
import { useData } from "./context/VideoContext.jsx";

import "./App.css";

function App() {
  const { setData, videoData } = useData();

  useEffect(() => {
    setData();
  }, []);

  return (
    <>
      <h1>YouTube Companion Dashboard</h1>
      <div className="video-layout-container">
        <div className="video-details-section">
          <VideoDetails video={videoData} />
        </div>
        <div className="video-notes-section">
          <VideoNotes />
        </div>
      </div>
    </>
  );
}

export default App;
