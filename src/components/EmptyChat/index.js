import React from "react";
import Lottie from "lottie-react";
import ChatterGuy from "../../assets/animations/ChatterGuy.json";

const EmptyChat = () => {
  return (
    <div className="w-100 h-100">
      <div
        className="flex flex-1 w-100 h-100 align-center justify-center flex-column !bg-base-100"
        style={{ padding: "40px" }}
      >
        <Lottie
          animationData={ChatterGuy}
          loop={true}
          className="lottie-holder"
        />
        <div
          style={{
            marginBlock: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "26px" }} className="text-base-content">
            Connect, Collaborate &{" "}
            <span className="text-primary">Create&nbsp;!</span>
          </h1>
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              marginBlock: "10px",
              maxWidth: "65%",
              color: "grey",
            }}
          >
            You can use TalkTime, to connect & build relationships with like-minded
            individuals to unleash your creativity and to bring ideas to life !
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
