import React, { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Drawer, Popover, Row } from "antd";
import { connect } from "react-redux";

import { IoCloseSharp, IoEllipsisVertical } from "react-icons/io5";

import "./index.css";
import ChatSideUserOption from "../ChatSideUserOption";
import {
  capitalizeFirstLetter,
  getAvatarImg,
  getUserName,
} from "../../utils/common";
import StatusChanger from "../StatusChanger";
import useEventHandler from "../../hooks/useEventHandler";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const ChatSideHeader = ({ manager }) => {
  const [popUpUserVisible, setPopUpUserVisible] = useState(false);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const {currentTheme} = useContext(ThemeProvider)
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
  const themeColors={
    cupcake:'rgb(239, 234, 230) ',
    dark:'rgb(25, 30, 36) ',
    valentine:'rgb(230, 188, 218) ',
    light:'rgb(229, 231, 235) ',
    synthwave:'rgb(14, 9, 32) ',
    corporate:'rgb(237, 237, 237) ',
    coffee:'rgb(12, 8, 12) ',
    winter:'rgb(240, 246, 255) ',
    retro:'rgb(219, 201, 154) '
  }
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
                <span className="fw-800 profile-txt-style ">
                  {getAvatarImg(manager.user)}
                </span>
              </div>
            )}
          </div>
          <div className="h-100 flex align-start flex-column flex-1">
            <div
              className="fw-600 cursor-pointer fs-14 text-base-content"
              style={{ marginLeft: "-1px" }}
            >
              {getUserName(manager.user)}
            </div>
            <div
              className="flex align-center fs-10"
              style={{ marginTop: "3px" }}
            ></div>
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
          style={{backgroundColor:themeColors[currentTheme]}}
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
          closeIcon={<IoCloseSharp size={22} className="!text-red-500" />}
        >
          <div className="w-100 !bg-transparent">
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
