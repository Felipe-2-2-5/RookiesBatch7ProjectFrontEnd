import React, { useEffect, useState } from "react";
import { NotificationPopup } from "./components";
import Layout from "./components/Layout";
import { popupEventEmitter } from "./httpClient/httpClient";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const showPopupHandler = (message) => {
      console.log(message);
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
