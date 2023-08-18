import React, { useEffect, useState } from "react";
import { RiCheckDoubleFill, RiCheckFill } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import { TbFileDescription } from "react-icons/tb";
import {
  capitalizeFirstLetter,
  download,
  formatBytes,
  formatTime,
  getUserName,
  toDataUrl,
} from "../../../utils/common";
import { connect } from "react-redux";
import { getReceipt } from "../common";

const DocMessage = ({ from, datetime, content, receipt, type, contact, manager, user }) => {
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
      style={{
        display: "flex",
        paddingBlock: "2px",
        overflowY: "scroll",
        overflowX: "hidden",
        flexDirection: "column",
        alignItems: from === manager.user?.jid ? "flex-end" : "flex-start",
      }}
      className="bg-base-100"
    >
      <div
        style={{
          fontWeight: 500,
          borderRadius: "13px",
          fontSize: "12px",
          width: "fit-content",
          padding: "10px",
          display: "flex",
          position: "relative",
          minWidth: "240px",
          flexDirection: "column",
        }}
        className="text-white bg-primary"
      >
        {from !== manager.user?.jid && type === "groupchat" && (
          <span style={{ textAlign: "start", fontSize: "9px" }}>{`~ ${messageBy}`}</span>
        )}
        <div
          style={{
            padding: "7px",
            marginTop: "-2px",
            display: "flex",
            alignItems: "center",
            maxWidth: "450px",
            textAlign: "start",
            flex: 2,
          }}
        >
          <div
            style={{
              borderRadius: "13px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TbFileDescription
              style={{
                fontSize: "28px",
                display: "flex",
                flex: 1,
              }}
            />
          </div>
          <div
            style={{
              paddingInline: "10px",
              display: "flex",
              flex: 9,
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {content["name"]}
            </div>
            <div style={{ fontSize: "10px" }}>{formatBytes(content["size"])}</div>
          </div>
          <div style={{ display: "flex", flex: 1, cursor: "pointer" }}>
            {from !== manager.user?.jid && (
              <FiDownload
                style={{ fontSize: "18px" }}
                onClick={() =>
                  toDataUrl(content["url"], function (base64) {
                    download(base64, content["name"]);
                  })
                }
              />
            )}
            {/* <LoadingOutlined style={{ fontSize: "18px" }} /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(DocMessage);
