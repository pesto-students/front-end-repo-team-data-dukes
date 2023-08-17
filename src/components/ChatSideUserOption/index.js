import { Button } from "antd";
import React, { useContext } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { ThemeProvider, getRandomTheme } from "../../store/context/ThemeProvider";

const ChatSideUserOption = () => {
  const { width } = useWindowDimensions();
  const {currentTheme,setCurrentTheme} = useContext(ThemeProvider);
 
  return (
    <div data-theme={currentTheme} style={{ minWidth: "200px" }} className="!bg-transparent">
      <div
        className="pop-content cursor-pointer fw-600 fs-12  !bg-base-100 overflow-hidden rounded-6 mb-10"
        
      >
        <Button
          className="fw-600 fs-12 w-100 bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
          style={{ textAlign: "start", border: 0, boxShadow: "none" }}
          type="default"
          size={width > 800 ? "medium" : "large"}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("show-create-group-drawer", {}));
          }}
        >
          Create Group
        </Button>
      </div>
      <Button
          className="fw-600 fs-12 w-100 mb-10 bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
          style={{ textAlign: "start", border: 0, boxShadow: "none" }}
          type="default"
          size={width > 800 ? "medium" : "large"}
          onClick={() => setCurrentTheme(getRandomTheme())}
        >
          Change Theme
        </Button>
      <Button
        className="fw-600 fs-12 w-100"
        type="primary"
        size={width > 800 ? "medium" : "large"}
        danger
        onClick={() => {
          window.dispatchEvent(new CustomEvent("auth-chat-logout", {}));
        }}
      >
        Logout
      </Button>

    </div>
  );
};

export default ChatSideUserOption;
