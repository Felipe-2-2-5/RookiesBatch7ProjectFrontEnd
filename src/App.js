import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import PopupNotification from "./components/PopupNotification";
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
      <PopupNotification
        open={showPopup}
        title="Error"
        message={popupMessage}
        handleClose={handleClose}
      />
    </div>
  );
}

export default App;
