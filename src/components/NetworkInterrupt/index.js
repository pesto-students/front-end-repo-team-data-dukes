import React from "react";
import Lottie from "lottie-react";

import NoInternet from "../../assets/animations/noInternet.json";

import "./index.css";
import { TbLogout } from "react-icons/tb";

const NetworkInterrupt = () => {
  return (
    <React.Fragment>
      <div
        className="w-100 fw-600 cursor-pointer color-danger flex align-center justify-end"
        onClick={() => {}}
        style={{ fontSize: "13px" }}
      >
        <span className="flex align-center p-10">
          Logout{" "}
          <TbLogout
            size={18}
            style={{ marginLeft: "5px", marginTop: "-2px" }}
          />
        </span>
      </div>
      <div
        className="flex align-center justify-center h-100"
        style={{ flexDirection: "column" }}
      >
        <Lottie
          animationData={NoInternet}
          loop={true}
          className="lottie-holder"
          style={{ height: "250px" }}
        />
        <h2 style={{ marginTop: "20px", marginBottom: "5px" }}>
          No Internet Connection
        </h2>
        <h4>
          Reconnecting&nbsp;
          <div className="loading"></div>
        </h4>
      </div>
    </React.Fragment>
  );
};

export default NetworkInterrupt;
