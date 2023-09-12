import React, { useState } from "react";

import { Provider as ReduxProvider } from "react-redux";
import { ConfigProvider } from "antd";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "../store/store";
import Router from "../router/Router";
import {ThemeProvider,Theme } from "../store/context/ThemeProvider";
import { defaultMeetingRoom } from "../utils/constants";

const App = () => {
  const [currentTheme,setCurrentTheme] = useState(Theme[1]);
  const [meetingStatus,setMeetingStatus] = useState({status:false,roomId:defaultMeetingRoom,isRecipient:false});
  return (
    <ThemeProvider.Provider value={{currentTheme,setCurrentTheme,meetingStatus,setMeetingStatus}}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#007bff",
              fontFamily: "Poppins",
            },
          }}
        >
          <Router />
        </ConfigProvider>
      </PersistGate>
    </ReduxProvider>
    </ThemeProvider.Provider>
  );
};

export default App;
