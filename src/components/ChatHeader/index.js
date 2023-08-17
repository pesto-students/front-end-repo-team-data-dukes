import React, { useContext, useEffect, useState } from "react";
import { Row } from "antd";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { connect } from "react-redux";

import { RxDotFilled } from "react-icons/rx";
import { IoChevronBack, IoEllipsisVertical } from "react-icons/io5";
import { MdGroups } from "react-icons/md";

import "./index.css";
import { setFocus } from "../../store/actions/contactAction";
import { capitalizeFirstLetter, getAvatarImg, getUserName, isGroup } from "../../utils/common";
import { Link } from "react-router-dom";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const ChatHeader = ({ contact, setFocus }) => {
  const [showBackArrow, setShowBackArrow] = useState(null);
  const { width } = useWindowDimensions();
  const {currentTheme} = useContext(ThemeProvider);
  useEffect(() => {
    if (width < 800) setShowBackArrow(true);
  }, [width]);

  const getStatus = () => {
    if (contact.status[contact.focus] === "chat") {
      return ["Online", "#00ff00"];
    } else if (contact.status[contact.focus] === "busy") {
      return ["Busy", "#dc3545"];
    } else {
      return ["Offline", "#808080"];
    }
  };

  const getChatStatus = () => {
    if (!isGroup(contact.focus)) {
      const [text, color] = getStatus();
      return (
        <div className="flex fw-600 align-center">
          <RxDotFilled
            size={20}
            style={{
              marginTop: "1px",
              color: color,
              marginLeft: "-5px",
            }}
          />
          {text}
        </div>
      );
    }
    return;
  };

  return (
    <React.Fragment>
      <Row className={`w-100 align-center p-10 gap-10 position-relative text-base-content`}>
        <div data-theme={currentTheme} className="flex align-center w-100" style={{ gap: 20 }}>
          {showBackArrow && (
            <div className="flex align-center" style={{ width: "25px", height: "50px", marginLeft: -15 }}>
              <IoChevronBack
                size={22}
                onClick={() => {
                  setFocus(null);
                }}
              />
            </div>
          )}
          <div className="flex" style={{ marginTop: "4.33px" }}>
            {contact.details[contact.focus]?.avatar_url && (
              <img
                src={contact.details[contact.focus]?.avatar_url}
                className="cursor-pointer flex justify-center  align-center profile-img-style"
              />
            )}
            {!contact.details[contact.focus]?.avatar_url && !isGroup(contact.details[contact.focus]?.jid) && (
              <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary text-base-content-focus">
                <span className="fw-800 profile-txt-style ">{getAvatarImg(contact.details[contact.focus])}</span>
              </div>
            )}
            {!contact.details[contact.focus]?.avatar_url && isGroup(contact.details[contact.focus]?.jid) && (
              <div className="cursor-pointer !bg-primary  text-base-content-focus flex justify-center align-center profile-img-style">
                <MdGroups color="#ffffff" size={28} style={{ marginTop: "-5px" }} />
              </div>
            )}
          </div>
          <div className="h-100 flex align-start flex-column flex-1">
            <div
              className="fw-600 cursor-pointer fs-14"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {getUserName(contact.details[contact.focus])}
            </div>
            <div className="flex align-center fs-10">{getChatStatus()}</div>
          </div>
          {isGroup(contact.focus) && (
            <IoEllipsisVertical
              className="cursor-pointer"
              size={18}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("show-group-option-drawer", { detail: { roomJID: contact.focus } })
                );
              }}
            />
          )}
        </div>
      </Row>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { contact, manager } = state;
  return { contact, manager };
}

const mapDispatchToProps = {
  setFocus: setFocus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
