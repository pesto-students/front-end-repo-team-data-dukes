import React, { forwardRef } from "react";
import { Row, message } from "antd";
import { MdGroups } from "react-icons/md";
import { connect } from "react-redux";
import { GoPrimitiveDot } from "react-icons/go";

import "./index.css";
import { capitalizeFirstLetter, formatTime, isGroup } from "../../utils/common";

const ChatUser = ({ jid, contact, manager }) => {
  const fileteredMessages = contact.message[jid]?.filter((message)=>message.datetime !== null)
  console.log("filtereed",fileteredMessages?.at(-1))
  console.log("ChatUser",contact.message[jid]);
  console.log("chatuser",contact.message[jid]);
  const AvatarViewSelector = () => {
    return (
      <div className="flex" style={{ marginTop: "4.33px" }}>
        {contact.details[jid]?.avatar_url && (
          <img
            alt="Avatar"
            src={contact.details[jid]?.avatar_url}
            className="cursor-pointer flex justify-center align-center profile-img-style "
          />
        )}
        {!contact.details[jid]?.avatar_url && !isGroup(jid) && (
          <div className="cursor-pointer flex justify-center align-center profile-img-style !text-base-content-focus !bg-primary">
            <span className="fw-800 profile-txt-style ">
              {capitalizeFirstLetter(contact.details[jid]?.first_name.charAt(0)) +
                capitalizeFirstLetter(contact.details[jid]?.last_name.charAt(0))}
            </span>
          </div>
        )}
        {!contact.details[jid]?.avatar_url && isGroup(jid) && (
          <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary !text-base-content-focus">
            <MdGroups color="#ffffff" size={28} style={{ marginTop: "-5px" }} />
          </div>
        )}
      </div>
    );
  };

  const ContentViewSelector = () => {
    return (
      <div className="h-100 flex flex-1 flex-column align-start">
        <div
          className="fw-600 cursor-pointer fs-14"
          style={{
            marginLeft: "-1px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {`${capitalizeFirstLetter(contact.details[jid]?.first_name)} ${capitalizeFirstLetter(
            contact.details[jid]?.last_name
          )}`}
        </div>
        <div
          className="fs-10 flex align-center"
          style={{
            textAlign: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginTop: "2px",
          }}
        >
          <LastMessageRender />
        </div>
      </div>
    );
  };

  const LastMessageRender = () => {
    if (contact.message[jid]?.at(-1)?.messageType === "text" || contact.message[jid]?.at(-1)?.messageType === "info") {
      return contact.message[jid]?.at(-1)?.content;
    } else if (contact.message[jid]?.at(-1)?.messageType === "gif") {
      return "GIF";
    } else if (contact.message[jid]?.at(-1)?.messageType === "img") {
      return "IMAGE";
    } else if (contact.message[jid]?.at(-1)?.messageType === "doc") {
      return "DOCUMENT";
    }
  };

  return (
    <Row
      className={`w-100 userchat ${jid === contact.focus && "selected"} text-base-content`}
      style={{
        height: "74px",
        position: "relative",
        alignItems: "center",
        padding: "0px 10px",
        gap: 10,
        paddingInline: "5px",
        overflow: "hidden",
      }}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("update-chat-focus", { detail: { jid } }));
      }}
    >
      <div className="w-100 flex mbo-10" style={{ gap: 10 }}>
        <AvatarViewSelector />
        <ContentViewSelector />
        <div className="flex h-100 flex-column">
          <div className="fs-10 grey">{formatTime(fileteredMessages?.at(-1)?.datetime)}</div>
          {contact.message[jid]?.at(-1)?.receipt !== 2 &&
            contact.message[jid]?.at(-1)["from"] !== manager.user?.jid &&
            !isGroup(jid) && (
              <div className="flex flex-1 justify-center align-center">
                <GoPrimitiveDot color="#007bff" style={{ marginTop: "10px" }} />
              </div>
            )}
        </div>
      </div>
    </Row>
  );
};

function mapStateToProps(state) {
  const { contact, manager } = state;
  return { contact, manager };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatUser);
