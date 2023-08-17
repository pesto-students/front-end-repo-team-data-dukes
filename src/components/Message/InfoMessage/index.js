import React from "react";

const InfoMessage = ({ content }) => {
  return (
    <div
      className="flex align-center justify-center"
      style={{ paddingBlock: "5px" }}
    >
      <div
      className="text-white bg-primary"
        style={{
          fontSize: "11px",
          width: "fit-content",
          paddingInline: "10px",
          paddingBlock: "5px",
          
          borderRadius: "10px",
          alignSelf: "center",
          display: "flex",
          fontWeight: 600,
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default InfoMessage;
