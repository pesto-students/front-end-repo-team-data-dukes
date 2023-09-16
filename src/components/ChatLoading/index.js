import React, { useContext } from "react";
import Lottie from "lottie-react";

import chatLoading from "../../assets/animations/chatLoading.json";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const ChatLoading = () => {
  const {currentTheme} = useContext(ThemeProvider)
 
  return (
    <React.Fragment>
      <div
        data-theme={currentTheme}
        className="flex align-center justify-center h-100 bg-base-100"
        style={{ flexDirection: "column" }}
      >
        <Lottie
          animationData={chatLoading}
          loop={true}
          className="lottie-holder"
          style={{ height: "250px" }}
        />
      </div>
    </React.Fragment>
  );
};

export default ChatLoading;
