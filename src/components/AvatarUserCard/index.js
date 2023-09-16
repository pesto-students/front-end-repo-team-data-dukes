import React, { useState } from "react";
import { Tooltip } from "antd";
import { connect } from "react-redux";

import "./index.css";
import { IoRemoveCircle } from "react-icons/io5";

const AvatarUserCard = ({ jid, contact, onContactSelect }) => {
  return (
    <Tooltip
      placement="bottom"
      arrow={false}
      align={{ offset: [0, -5] }}
      title={
        <span style={{ fontSize: "10px", fontWeight: 600 }}>
          {contact.details[jid]?.first_name + " " + contact.details[jid]?.last_name}
        </span>
      }
    >
      <div style={{ position: "relative", height: "fit-content" }}>
        <div
          className="remove-user cursor-pointer"
          style={{ position: "absolute", top: -5, right: -5 }}
          onClick={() => {
            onContactSelect({ jid });
          }}
        >
          <IoRemoveCircle size={20} style={{ color: "#dc3545" }} />
        </div>
        <div
          className="align-center user-io"
          style={{
            margin: "10px",
            gap: 15,
            width: "fit-content",
            display: "inline-flex",
          }}
        >
          {contact.details[jid]?.avatar_url && (
            <img
              src={contact.details[jid]?.avatar_url}
              className="cursor-pointer flex justify-center align-center profile-img-style"
            />
          )}
          {!contact.details[jid]?.avatar_url && (
            <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary !text-base-content-focus">
              <span className="fw-800 profile-txt-style ">
                {contact.details[jid]?.first_name.charAt(0).toUpperCase() +
                  contact.details[jid]?.last_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

function mapStateToProps(state) {
  const { contact } = state;
  return { contact };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AvatarUserCard);
