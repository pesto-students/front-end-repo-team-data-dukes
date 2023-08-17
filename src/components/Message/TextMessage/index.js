import { useEffect, useState } from "react";
import { RiCheckFill, RiCheckDoubleFill } from "react-icons/ri";
import { connect } from "react-redux";
import { capitalizeFirstLetter, formatTime, getUserName } from "../../../utils/common";

import "./index.css";
import { getReceipt } from "../common";

const TextMessage = ({ from, content, receipt, datetime, id, type, contact, manager, user }) => {
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
      key={id}
      style={{
        display: "flex",
        paddingBlock: "2px",
        overflowY: "scroll",
        overflowX: "hidden",
        flexDirection: "column",
        alignItems:
          type !== "groupchat"
            ? from === manager.user?.jid
              ? "flex-end"
              : "flex-start"
            : user === manager.user?.username
            ? "flex-end"
            : "flex-start",
      }}
    >
      <div
      className= {`${type !== "groupchat"
      ? from === manager.user?.jid
        ? "bg-primary" //sender
        : "bg-neutral"//reciever
      : user === manager.user?.username
      ? "bg-primary"
      : "bg-neutral"}`
    }
        style={{
          
          fontWeight: 600,
          borderRadius: "15px",
          fontSize: "12px",
          width: "fit-content",
          padding: "8px",
          paddingLeft: "16px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          minWidth: "100px",
        }}
      >
        {user !== manager.user?.username && type === "groupchat" && (
          <span style={{ textAlign: "start", fontSize: "9px" }}>{`~ ${messageBy}`}</span>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "450px",
            textAlign: "start",
            minWidth: "100px",
            position: "relative",
            paddingBottom: "3px",
          }}
        >
          {content}
        </div>
        <div
          style={{
            fontSize: "9px",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            marginBottom: "-2px",
          }}
        >
          {formatTime(datetime)}

          {type !== "groupchat" && (
            <div style={{ display: "flex", marginLeft: "3px" }}>
              {from === manager.user?.jid && <>{getReceipt(receipt)}</>}
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

export default connect(mapStateToProps, mapDispatchToProps)(TextMessage);

// backgroundColor:
//             type !== "groupchat"
//               ? from === manager.user?.jid
//                 ? "#007bff" //sender
//                 : "#555555"//reciever
//               : user === manager.user?.username
//               ? "#007bff"
//               : "#555555",