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
import { ResizablePIP } from "resizable-pip";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { ThemeProvider } from "../../store/context/ThemeProvider";
import { defaultMeetingRoom, meetingAppId } from "../../utils/constants";
const ChatHeader = ({ contact, setFocus,manager,connection }) => {
  const [showBackArrow, setShowBackArrow] = useState(null);
  const { width } = useWindowDimensions();
  const {currentTheme,setMeetingStatus,meetingStatus} = useContext(ThemeProvider);
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
  const handleMeetingEnd = ()=>{
    setMeetingStatus({status:false,roomId:defaultMeetingRoom});
  }
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
      <div className="flex flex-col flex-grow">
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
      {meetingStatus.status && <>
          <ResizablePIP>
            <div>
              <JaaSMeeting
                appId={meetingAppId}
                roomName={meetingStatus.roomId}
                configOverwrite={{
                  disableThirdPartyRequests: true,
                  disableLocalVideoFlip: true,
                  backgroundAlpha: 0.5,
                  defaultLogoUrl: '',
                  toolbarButtons: ['microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'info',
                    'recording', 'livestreaming', 'etherpad', 'sharedvideo', 'settings',
                    'raisehand', 'videoquality', 'filmstrip', 'invite', 'feedback', 'stats',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'mute-video-everyone']
                }}
                interfaceConfigOverwrite={{
                  VIDEO_LAYOUT_FIT: 'nocrop',
                  MOBILE_APP_PROMO: false,
                  TILE_VIEW_MAX_COLUMNS: 4,
                  
                }}
                userInfo = {{
                  displayName: `${manager.user.first_name} ${manager.user.last_name}`
              }}
                onApiReady={(externalApi) => {
                  if(!meetingStatus.isRecipient){
                    const meetUrl = `https://8x8.vc/${meetingAppId}/${meetingStatus.roomId}`
                    const content = `Hey, we're starting the meeting right now. Join us here:-${meetUrl}`
                    connection.message.send(contact.focus, isGroup(contact.focus) ? "groupchat" : "chat", "text", content);
                  }
                }}
                onReadyToClose={() => {
                  handleMeetingEnd();
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '700px'; }}
              />
            </div>
          </ResizablePIP>
        </>}
        </div>
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
