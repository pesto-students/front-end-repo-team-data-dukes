import { Empty } from "antd";
import React from "react";

const NoChat = () => {
  return (
    <div className="flex align-center justify-center" style={{ height: "60%" }}>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 70,
        }}
        description={
          <span
            style={{
              color: "grey",
              fontSize: "12px",
              marginTop: "10px",
            }}
          >
            No Chats
          </span>
        }
      />
    </div>
  );
};

export default NoChat;
