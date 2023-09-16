import { Button, Divider, Drawer, Input, Modal } from "antd";
import React, { useContext, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useEventHandler from "../../hooks/useEventHandler";
import { connect } from "react-redux";
import { HiOutlineLogout } from "react-icons/hi";
import { LoadingOutlined } from "@ant-design/icons";
import { FaUser } from "react-icons/fa";
import { getUserName, showNotificationMessage } from "../../utils/common";
import { BiPlus } from "react-icons/bi";
import { FcBookmark } from "react-icons/fc";
import { deleteRoom, extractJIDs, removeFromRoster } from "../../api/query";
import { setFocus } from "../../store/actions/contactAction";
import InviteDrawer from "../InviteDrawer";
import { ThemeProvider } from "../../store/context/ThemeProvider";
import "./index.css";
const GroupOptionDrawer = ({ connection, manager, contact, setFocus }) => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [toKickParticipants, setToKickParticipants] = useState([]);
  const {currentTheme} = useContext(ThemeProvider);
  const onShowDrawer = ({ detail }) => {
    setVisible(true);
  };

  const onReset = () => {
    setVisible(false);
    setShowSubjectModal(false);
    setShowInviteDrawer(false);
  };

  useEventHandler("show-group-option-drawer", onShowDrawer);
  useEventHandler("delete-room", onReset);

  const kickParticipants = (jid) => {
    setToKickParticipants((prev) => [...prev, jid]);
    connection.muc.modifyAffiliation(
      contact.focus,
      jid,
      "none",
      null,
      (st) => {
        console.log(st);
        window.dispatchEvent(
          new CustomEvent("delete-group-participant", {
            detail: { jid: jid, affiliation: "none", room: contact.focus },
          })
        );
        const removeUserMessage = `${getUserName(manager.user)} Removed ${getUserName(contact.details[jid])}`;
        connection.message.send(contact.focus, "groupchat", "info", removeUserMessage);
        setToKickParticipants((prev) => prev.filter((d) => d !== jid));
      },
      (et) => {
        console.log(et);
        showNotificationMessage("error", "Unable to Remove Participants !");
        setToKickParticipants((prev) => prev.filter((d) => d !== jid));
      }
    );
  };

  const participantContent = (
    <>
      <div
      data-theme={currentTheme}
        className="flex align-center w-100 bg-transparent"
        style={{
          justifyContent: "space-between",
          flexDirection: "column",
          textAlign: "start",
        }}
      >
        <div
          className="w-100 ml-5 flex align-center"
          style={{ fontSize: "12px", fontWeight: 600, color: "grey", justifyContent: "space-between" }}
        >
          <div>{`${contact.details[contact.focus]?.participants?.length}`} Participant{contact.details[contact.focus]?.participants?.length> 1 && 's'}</div>
          <div className="flex align-center cursor-pointer">
            {contact.details[contact.focus]?.isCurrentUserOwner && (
              <BiPlus size={20} className="text-base-content" onClick={() => setShowInviteDrawer(true)} />
            )}
          </div>
        </div>
        <Divider style={{ marginBlock: "12px" }} />
        <div className="w-100" style={{ maxHeight: "100%", overflowY: "scroll" }}>
          {contact.details[contact.focus]?.participants?.map((item) => {
            return (
              <div key={item["jid"]} className="flex justify-between p-10" style={{ width: "-webkit-fill-available" }}>
                <div className="flex align-center ">
                  <FaUser size={16} className="text-base-content" />
                  <div style={{ fontSize: "12px", marginLeft: "10px", fontWeight: 600 }}>
                    {`${manager.user?.jid === item["jid"] ? "You" : getUserName(contact.details[item["jid"]])}`}
                  </div>
                </div>
                {contact.details[contact.focus]?.isCurrentUserOwner && item["jid"] !== manager.user?.jid && (
                  <>
                    {toKickParticipants.includes(item["jid"]) ? (
                      <LoadingOutlined style={{ fontSize: 20 }} spin />
                    ) : (
                      <HiOutlineLogout
                        className="cursor-pointer"
                        size={18}
                        onClick={() => {
                          kickParticipants(item["jid"]);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  const ChangeSubjectView = () => {
    const [groupSubject, setGroupSubject] = useState("");
    const [loading, setLoading] = useState(false);

    useEventHandler("update-group-subject/response", ({ detail }) => {
      const { status } = detail;
      setLoading(false);
      setShowSubjectModal(false);
      if (status !== "SUCCESS") {
        showNotificationMessage("error", "Error Updating Group Name !", "Please try again...!");
      }
    });

    return (
      <Modal
        title={<div className="mt-10 ml-5">Change Room Subject</div>}
        centered
        open={showSubjectModal}
        onCancel={() => {
          setShowSubjectModal(false);
        }}
        footer={null}
        style={{ padding: "10px" }}
        closeIcon={<IoCloseSharp size={22} className="text-red-500" />}
      >
        <Input
          prefixCls="search"
          value={groupSubject}
          onChange={(e) => {
            setGroupSubject(e.target.value);
          }}
          placeholder="Group Subject"
          style={{ borderRadius: "10px", padding: "10px", marginBlock: "20px" }}
          suffix={<FcBookmark size={16} color="#007bff" />}
        />
        <div data-theme={currentTheme} className="flex justify-end bg-transparent">
          <Button
            className="fw-600 fs-12 bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
            size="large"
            disabled={groupSubject.trim().length < 5}
            loading={loading}
            onClick={() => {
              if (groupSubject.trim() !== "") {
                setLoading(true);
                window.dispatchEvent(
                  new CustomEvent("update-group-subject", { detail: { subject: groupSubject, room: contact.focus } })
                );
              }
            }}
          >
            Change
          </Button>
        </div>
      </Modal>
    );
  };

  const onDLBtnClick = () => {
    if (contact.details[contact.focus]?.isCurrentUserOwner) {
      const onDeleteSuccess = (st, room) => {
        console.log(st, room);
        removeFromRoster(connection, room);
        setFocus(null);
        onReset();
        showNotificationMessage("success", "Room Deleted Successfully !");
      };
      const onDeleteFailure = (et) => {
        console.log(et);
        showNotificationMessage("error", "Unable to Delete Room !");
      };
      // Delete Room
      deleteRoom(connection, contact.focus, onDeleteSuccess, onDeleteFailure);
    } else {
      //Leave Room
      const inviteMessage = `${getUserName(manager.user)} Left`;
      connection.message.send(contact.focus, "groupchat", "info", inviteMessage);
      connection.muc.leave(contact.focus, manager.user?.username, (s) => {
        removeFromRoster(connection, contact.focus);
        setFocus(null);
        onReset();
        console.log("Left Room");
      });
    }
  };

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
    <React.Fragment>
      <Drawer
        width={width < 700 ? width : 400}
        style={{backgroundColor:themeColors[currentTheme]}}
        open={visible}
        closeIcon={<IoCloseSharp size={22} className="!text-red-500" />}
        onClose={onReset}
        contentWrapperStyle={{ borderRadius: width < 800 && 0 }}
        title={
          <h1
            data-Theme={currentTheme}
            className="flex align-center !text-base-content bg-transparent"
            style={{
              flex: 1,
              fontSize: "23px",
              fontWeight: 800,
              justifyContent: "flex-start",
              paddingInline: "10px",
            }}
          >
            {"Group Settings"}
          </h1>
        }
      >
        <div data-theme={currentTheme} className="flex h-100 bg-transparent" style={{ flexDirection: "column", justifyContent: "space-between" }}>
          <div className="flex">{participantContent}</div>
          <div className="flex" style={{ flexDirection: "column" }}>
            {/* <div className="w-100 ml-5 text-base-content" style={{ fontSize: "12px", fontWeight: 600, color: "grey" }}>
              Room Setting's
            </div> */}
            <Divider style={{ marginBlock: "12px" }} />
            <Button
              className="fw-600 fs-12 w-100 bg-primary hover:bg-primary-focus text-center hover:!text-primary-content border-none text-primary-content"
              type="default"
              style={{
                border: "none",
                marginBlock: "15px",
                textAlign: "start",
                boxShadow: "none",
              }}
              onClick={() => {
                setVisible(false);
                setShowSubjectModal(true);
              }}
            >
              Change Subject
            </Button>
            <Button className="fw-600 fs-12 w-100" type="primary" danger size="large" onClick={onDLBtnClick}>
              {contact.details[contact.focus]?.isCurrentUserOwner ? "Delete Room" : "Leave Room"}
            </Button>
          </div>
        </div>
      </Drawer>
      <ChangeSubjectView />
      <InviteDrawer
        ignoreJid={contact.details[contact.focus]?.participants}
        connection={connection}
        visible={showInviteDrawer}
        setVisible={setShowInviteDrawer}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {
  setFocus: setFocus,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupOptionDrawer);
