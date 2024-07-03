import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import NotificationPopup from "./components/NotificationPopup";
import { popupEventEmitter } from "./httpClient/httpClient";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const showPopupHandler = (message) => {
      setPopupMessage(message);
      setShowPopup(true);
    };
    popupEventEmitter.on("showPopup", showPopupHandler);

    return () => {
      popupEventEmitter.off("showPopup", showPopupHandler);
    };
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <Layout />
      <NotificationPopup
        open={showPopup}
        title="Error"
        content={popupMessage}
        handleClose={handleClose}
      />
    </div>
  );
}

export default App;
