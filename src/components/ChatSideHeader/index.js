import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Drawer, Popover, Row } from "antd";
import { connect } from "react-redux";

import { IoCloseSharp, IoEllipsisVertical } from "react-icons/io5";

import "./index.css";
import ChatSideUserOption from "../ChatSideUserOption";
import { capitalizeFirstLetter, getAvatarImg, getUserName } from "../../utils/common";
import StatusChanger from "../StatusChanger";
import useEventHandler from "../../hooks/useEventHandler";

const ChatSideHeader = ({ manager }) => {
  const [popUpUserVisible, setPopUpUserVisible] = useState(false);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);

  const { width } = useWindowDimensions();

  useEffect(() => {
    setPopUpUserVisible(false);
    setShowBottomDrawer(false);
  }, [width]);

  const resetPopUp = () => {
    setPopUpUserVisible(false);
    setShowBottomDrawer(false);
  };

  useEventHandler("show-create-group-drawer", resetPopUp);
  useEventHandler("show-create-contact-drawer", resetPopUp);

  return (
    <div className="flex align-center justify-start flex-1 h-70 ">
      <Row
        className={`w-100 align-center p-10 gap-10 position-relative `}
        style={{ paddingInline: "5px" }}
      >
        <div className="flex align-center w-100" style={{ gap: 20 }}>
          <div className="flex" style={{ marginTop: "4.33px" }}>
            {manager.user["avatar_url"] && (
              <img
                src={manager.user["avatar_url"]}
                className="cursor-pointer flex justify-center align-center profile-img-style"
              />
            )}
            {!manager.user["avatar_url"] && (
              <div className="cursor-pointer flex justify-center align-center profile-img-style !bg-primary text-base-content-focus">
                <span className="fw-800 profile-txt-style ">{getAvatarImg(manager.user)}</span>
              </div>
            )}
          </div>
          <div className="h-100 flex align-start flex-column flex-1">
            <div className="fw-600 cursor-pointer fs-14 text-base-content" style={{ marginLeft: "-1px" }}>
              {getUserName(manager.user)}
            </div>
            <div className="flex align-center fs-10" style={{ marginTop: "3px" }}>
             {/* TODO: aaply app logo here */}
              {/* <StatusChanger /> */}
              {/* <div className="flex fw-600">veer@localhost</div> */}
            </div>
          </div>
        </div>
      </Row>
      <div className="flex align-center h-100 text-base-content cursor-pointer">
        {width > 500 ? (
          <Popover
            placement="bottomRight"
            content={<ChatSideUserOption />}
            trigger="click"
            align={{ offset: [0, 0] }}
            open={popUpUserVisible}
            arrow={false}
            onOpenChange={(visible) => {
              setPopUpUserVisible(visible);
            }}
          >
            <div className="flex p-10">
              <IoEllipsisVertical size={18} />
            </div>
          </Popover>
        ) : (
          <div
            className="flex p-10"
            onClick={() => {
              setShowBottomDrawer(true);
            }}
          >
            <IoEllipsisVertical size={18} />
          </div>
        )}

        <Drawer
          open={showBottomDrawer}
          onClose={() => setShowBottomDrawer(false)}
          placement="right"
          contentWrapperStyle={
            {
              // Uncomment for placement bottom
              // borderTopLeftRadius: "20px",
              // borderTopRightRadius: "20px",
            }
          }
          bodyStyle={{ paddingTop: 0, display: "flex", alignItems: "end" }}
          height={"200px"}
          closeIcon={<IoCloseSharp size={22} color="#000" />}
        >
          <div className="w-100 !bg-base-100">
            <ChatSideUserOption />
          </div>
        </Drawer>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const { manager } = state;
  return { manager };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatSideHeader);
