import { Popover } from "antd";
import React, { useEffect, useState } from "react";
import { RiCheckDoubleFill, RiCheckFill } from "react-icons/ri";
import { connect } from "react-redux";
import { capitalizeFirstLetter, formatTime, getUserName } from "../../../utils/common";

import "./index.css";
import { getReceipt } from "../common";

const ImageMessage = ({ from, content, receipt, messageType, datetime, type, contact, manager, user }) => {
  // Used Only in Case of GroupChat
  const [messageBy, setMessageBy] = useState("");

  useEffect(() => {
    Object.keys(contact.details).forEach((jid) => {
      if (contact.details[jid]["username"] === user) {
        setMessageBy(getUserName(contact.details[jid]));
      }
    });
  }, []);

  return (
    <div
      className="text-base-100"
      style={{
        display: "flex",
        paddingBlock: "2px",
        overflowY: "scroll",
        overflowX: "hidden",
        flexDirection: "column",
        alignItems: from === manager.user?.jid ? "flex-end" : "flex-start",
      }}
    >
      <div
       className= {`${from === manager.user?.jid 
         ? "bg-primary" //sender
         : "bg-neutral"//reciever
       }`
     }
        style={{
          fontWeight: 500,
          borderRadius: "17px",
          padding: "4px",
          fontSize: "13px",
          width: "fit-content",
          color: "#fff",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            textAlign: "start",
            flexDirection: "column",
          }}
        >
          {from !== manager.user?.jid && type === "groupchat" && (
            <span style={{ textAlign: "start", fontSize: "9px", padding: "5px" }}>{`~ ${messageBy}`}</span>
          )}
          <div className="vignette">
            {/* <LoadingOutlined
              style={{
                fontSize: "50px",
                position: "absolute",
                top: "calc(50% - 23px)",
                left: "calc(50% - 23px)",
              }}
            /> */}

            <img
              style={{
                objectFit: messageType == "gif" ? "contain" : "cover",
                width: messageType == "gif" ? content["width"] : "250px",
                height: messageType == "gif" ? content["height"] : "300px",
                borderRadius: "14px",
              }}
              src={content["url"]}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: "9px",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: "10px",
            bottom: "10px",
          }}
        >
          {formatTime(datetime)}

          {type === "chat" && (
            <div style={{ display: "flex", marginLeft: "3px" }}>
              <>{from === manager.user?.jid && <>{getReceipt(receipt)}</>}</>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const { contact, manager } = state;
  return { contact, manager };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ImageMessage);

//backgroundColor: from === manager.user?.jid ? "#007bff" : "#555555",
         