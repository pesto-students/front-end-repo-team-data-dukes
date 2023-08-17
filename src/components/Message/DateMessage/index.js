import { Divider } from "antd";
import React from "react";
import { formatDateMessage } from "../../../utils/common";

const DateMessage = ({ datetime }) => {
  return (
    <Divider plain>
      <div className="flex justify-center p-10">
        <div
          className="text-white bg-primary"
          style={{
            fontSize: "12px",
            width: "fit-content",
            paddingInline: "20px",
            paddingBlock: "7px",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          {formatDateMessage(datetime)}
        </div>
      </div>
    </Divider>
  );
};

export default DateMessage;
