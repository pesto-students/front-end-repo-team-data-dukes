import { Button, Drawer, Empty, Input, List } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { TbRefresh } from "react-icons/tb";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import SelectContactCard from "../SelectContactCard";
import { BiSearch } from "react-icons/bi";
import { getUserName, isGroup, showNotificationMessage } from "../../utils/common";
import { connect } from "react-redux";

import "./index.css";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const InviteDrawer = ({ ignoreJid, connection, visible, setVisible, manager, contact }) => {
  const { width } = useWindowDimensions();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [ignoreJID, setIgnoreJID] = useState([]);
  const {currentTheme} = useContext(ThemeProvider);
  const onReset = () => {
    setVisible(false);
    setSelected([]);
  };

  useEffect(() => {
    if (ignoreJid) {
      const jids = [];
      ignoreJid.forEach((d) => {
        jids.push(d["jid"]);
      });
      setIgnoreJID(jids);
    }
  }, [ignoreJid]);

  const onContactSelect = ({ jid }) => {
    if (selected.includes(jid)) {
      const new_selected = [];
      selected.forEach((d) => {
        if (d != jid) {
          new_selected.push(d);
        }
      });
      setSelected(new_selected);
    } else {
      setSelected((d) => [...d, jid]);
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



  const sendInvites = () => {
    const inviter = manager.user;
    for (let i = 0; i < selected.length; i++) {
      const jid = selected[i];
      const invitee = contact?.details[jid];
      const inviteMessage = `${getUserName(inviter)} invited ${getUserName(invitee)}`;
      // Sending Directed Invite to all Participant's
      connection.muc.modifyAffiliation(
        contact.focus,
        jid,
        "member",
        null,
        (s) => {
          connection.muc.directInvite(contact.focus, jid);
          // Sending Info Message to the Group
          connection.message.send(contact.focus, "groupchat", "info", inviteMessage);
        },
        (e) => {
          console.log("ERROR INVITING USER'S : ", e);
        }
      );
    }
    onReset();
    showNotificationMessage("success", "Invitation Sent !");
  };

  const AddMode = (
    <React.Fragment>
      <div className="w-100">
        <Input
          prefixCls="search"
          placeholder="Search Contacts"
          className="bg-base-200 text-base-content placeholder:!text-base-content border-none"
          classNames={{input:"bg-base-200 text-base-content placeholder:!text-base-content border-none"}}
          style={{ borderRadius: "20px", padding: "10px" }}
          prefix={<BiSearch color="grey" size={18} />}
          onChange={(e) => {}}
        />
      </div>
      {Object.keys(contact.details)?.length > 0 && (
        <List
          className="contact-list"
          style={{ marginBlock: "10px", height: "100%" }}
          itemLayout="horizontal"
          dataSource={Object.keys(contact.details)}
          renderItem={(jid, index) => {
            // Ignoring Current User Details in Contacts
            if (manager.user?.jid !== jid && !isGroup(jid) && !ignoreJID.includes(jid)) {
              return (
                <SelectContactCard
                  onContactSelect={onContactSelect}
                  avatarUrl={contact.details[jid]["avatar_url"]}
                  firstName={contact.details[jid]["first_name"]}
                  lastName={contact.details[jid]["last_name"]}
                  emailId={contact.details[jid]["email_id"]}
                  mobileNo={contact.details[jid]["mobile_no"]}
                  jid={jid}
                  selected={selected}
                />
              );
            }
          }}
        />
      )}
      {Object.keys(contact.details)?.length == 0 && (
        <div className="flex align-center justify-center" style={{ height: "90%" }}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 70,
            }}
            description={
              <span style={{ color: "grey", fontSize: "12px", marginTop: "10px" }}>No Contacts Available</span>
            }
          />
        </div>
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Drawer
      style={{backgroundColor:themeColors[currentTheme]}}
        width={width < 700 ? width : 400}
        contentWrapperStyle={{ borderRadius: width < 800 && 0 }}
        title={
          <div data-theme={currentTheme}  className="flex align-center cursor-pointer bg-transparent">
            <h1
              className="flex align-center text-base-content"
              style={{
                flex: 1,
                fontSize: "23px",
                fontWeight: 800,
                justifyContent: "flex-start",
                paddingInline: "10px",
              }}
            >
              {"Invite Participants"}
            </h1>
            <TbRefresh
              className={`${refreshLoading ? "rotate" : ""}`}
              size={20}
              style={{ marginTop: "2px" }}
              onClick={() => {}}
            />
          </div>
        }
        placement="right"
        closable={true}
        onClose={onReset}
        open={visible}
        key={"contacts"}
        closeIcon={<IoChevronBack size={20} color="#000" />}
      >
        <div data-theme={currentTheme} className="flex h-100 flex-column bg-transparent">{AddMode}</div>
        <div data-theme={currentTheme} className={`w-100 flex justify-end bg-transparent`}>
          <Button
            size="large"
            className="flex align-center justify-center fw-600 fs-12  bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
            style={{ minWidth: "80px" }}
            disabled={!selected.length > 0}
            loading={false}
            onClick={sendInvites}
          >
            Invite
          </Button>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InviteDrawer);
