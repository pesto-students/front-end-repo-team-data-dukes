import { Button, Divider, Drawer, Empty, Input, List } from "antd";
import React, { useContext, useState } from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { TbRefresh } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import useEventHandler from "../../hooks/useEventHandler";
import { BiSearch } from "react-icons/bi";
import { connect } from "react-redux";
import SelectContactCard from "../SelectContactCard";
import AvatarUserCard from "../AvatarUserCard";
import { generate_id } from "../../stanza/utils";
import { config } from "../../config/config";
import { addToRoster, createRoom } from "../../api/query";
import {
  capitalizeFirstLetter,
  createGenerateParticipants,
  generateRoomRoster,
  isGroup,
  showNotificationMessage,
} from "../../utils/common";
import { InsertContactDetails } from "../../store/actions/contactAction";
import { ThemeProvider } from "../../store/context/ThemeProvider";

const CreateGroupDrawer = ({ manager, contact, connection, InsertContactDetails }) => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);

  //Raw State
  const [selected, setSelected] = useState([]);
  const [screenMode, setScreenMode] = useState("ADD");
  const [groupSubject, setGroupSubject] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [createRoomBtnLoading, setCreateRoomBtnLoading] = useState(false);
  const {currentTheme} = useContext(ThemeProvider)
  const onShowDrawer = () => {
    setVisible(true);
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

  useEventHandler("show-create-group-drawer", onShowDrawer);

  const onContactSelect = ({ jid }) => {
    if (selected.includes(jid)) {
      const new_selected = [];
      selected.forEach((d) => {
        if (d !== jid) {
          new_selected.push(d);
        }
      });
      if (new_selected.length === 0) {
        setScreenMode("ADD");
      }
      setSelected(new_selected);
    } else {
      setSelected((d) => [...d, jid]);
    }
  };

  const onCreateGroupSuccess = (iq, gid) => {
    //presence -> x -> statuscode === 201 ( New Room Created )
    if (groupSubject.trim() !== "") {
      connection.muc.setTopic(gid, groupSubject);
    }
    const participants = createGenerateParticipants(selected, manager.user);
    const roomRoster = generateRoomRoster(gid, groupSubject, participants);
    InsertContactDetails({ jid: roomRoster["jid"], details: roomRoster });
    addToRoster(
      connection,
      roomRoster["jid"],
      (s) => {
        const inviter = manager.user;
        for (let i = 0; i < selected.length; i++) {
          const jid = selected[i];
          const invitee = contact?.details[jid];
          const inviteMessage = `${capitalizeFirstLetter(inviter.first_name)} ${capitalizeFirstLetter(
            inviter.last_name
          )} invited ${capitalizeFirstLetter(invitee.first_name)} ${capitalizeFirstLetter(invitee.last_name)}`;
          // Sending Directed Invite to all Participant's
          connection.muc.modifyAffiliation(
            gid,
            jid,
            "member",
            null,
            (s) => {
              connection.muc.directInvite(gid, jid);
              // Sending Info Message to the Group
              connection.message.send(gid, "groupchat", "info", inviteMessage);
            },
            (e) => {
              console.log("Error Modifying Affiliation !", e);
              showNotificationMessage("error", "Error Modifying Affiliation");
            }
          );
        }
        onReset();
      },
      (e) => {
        console.log("ERROR ADDING NEW ROOM TO ROSTER");
      }
    );
    setCreateRoomBtnLoading(false);
    setVisible(false);
  };

  const onCreateGroupFailure = (err, msg, gid) => {
    console.log(gid, msg, err);
    showNotificationMessage("error", msg);
    setCreateRoomBtnLoading(false);
  };

  const createGroup = () => {
    setCreateRoomBtnLoading(true);
    // TODO
    const randomGroupId = generate_id();
    const groupDomain = config["groupDomain"];
    const gid = `${randomGroupId}@${groupDomain}`;
    const nickname = manager.user.username;
    createRoom(connection, gid, nickname, onCreateGroupSuccess, onCreateGroupFailure);
  };

  const onFinish = () => {
    if (screenMode !== "CREATE") {
      setScreenMode("CREATE");
    } else {
      //Create Group
      createGroup();
    }
  };

  const onReset = () => {
    setVisible(false);
    setSelected([]);
    setGroupSubject("");
    setScreenMode("ADD");
    setCreateRoomBtnLoading(false);
    setRefreshLoading(false);
  };



  const AddMode = (
    <React.Fragment>
      <div className="w-100">
        <Input
          prefixCls="search"
          placeholder="Search Contacts"
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
            if (manager.user?.jid !== jid && !isGroup(jid)) {
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
      {Object.keys(contact.details)?.length === 0 && (
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

  const onChangeInput = (e) => {
    setGroupSubject(e.target.value);
  };

  const CreateMode = (
    <React.Fragment>
      <div data-Theme={currentTheme} className="w-100 bg-transparent" style={{ height: "100%" }}>
        <Input
          value={groupSubject}
          onChange={onChangeInput}
          placeholder="Group Subject"
          className="!bg-base-200 !text-base-content placeholder:!text-base-content border-none"
          classNames={{input:'!bg-base-200 !text-base-content placeholder:!text-base-content'}}
          style={{ borderRadius: "10px", padding: "10px", fontSize: "12px" }}
        />
        <p className="fs-12 mi-5 fw-600 mt-20 !text-base-content">Participant's</p>
        <Divider style={{ margin: 0 }} />
        <div
          className="w-100"
          style={{
            paddingBlock: "20px",
            flexWrap: "wrap",
            display: "flex",
          }}
        >
          {selected.map((jid) => {
            return <AvatarUserCard key={jid} jid={jid} onContactSelect={onContactSelect} />;
          })}
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Drawer
        width={width < 700 ? width : 400}
        style={{backgroundColor:themeColors[currentTheme]}}
        title={
          <div data-theme={currentTheme} className="flex align-center cursor-pointer bg-transparent">
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
              {screenMode === "ADD" ? "Add Participant's" : "Create Group"}
            </h1>
            <TbRefresh
              className={`${refreshLoading ? "rotate" : ""} text-primary`}
              size={20}
              onClick={() => {
                setRefreshLoading(true);
                setTimeout(() => {
                  setRefreshLoading(false);
                }, 3000);
              }}
            />
          </div>
        }
        placement="right"
        closable={true}
        onClose={onReset}
        contentWrapperStyle={{ borderRadius: width < 800 && 0 }}
        open={visible}
        key={"contacts"}
        closeIcon={<IoCloseSharp size={20}  className="text-error"/>}
        destroyOnClose
      >
        <div data-theme={currentTheme} className="flex h-100 flex-column bg-transparent">
          {screenMode === "ADD" ? AddMode : CreateMode}
          <div className={`w-100 flex ${screenMode === "ADD" ? "justify-end" : "justify-between"}`}>
            {screenMode === "CREATE" && (
              <Button
                size="large"
                type="default"
                disabled={createRoomBtnLoading}
                className="flex align-center justify-center fw-600 fs-12  bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
                style={{ minWidth: "80px", border: 0, boxShadow: "none" }}
                onClick={() => setScreenMode("ADD")}
              >
                Back
              </Button>
            )}
            <Button
              size="large"
              type="base-content"
              className="flex align-center justify-center fw-600 fs-12  bg-primary hover:bg-primary-focus hover:!text-primary-content border-none text-primary-content"
              style={{ minWidth: "80px" }}
              disabled={!selected.length > 0}
              loading={createRoomBtnLoading}
              onClick={onFinish}
            >
              {screenMode === "CREATE" ? "Create" : "Next"}
            </Button>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {
  InsertContactDetails: InsertContactDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupDrawer);
