import React, { useEffect, useState } from "react";
import { useInternetConnection } from "../../hooks/useInternetConnection";
import { connect } from "react-redux";
import useXMPP from "../../hooks/useXMPP";
import { Strophe } from "strophe.js";

import NetworkInterrupt from "../../components/NetworkInterrupt";
import ChatLoading from "../../components/ChatLoading";
import { fetchContacts } from "../../api/fetch";
import {
  generateRoomRoster,
  getGeneralGroupName,
  getUserName,
  isGroup,
  parseMessage,
  showNotificationMessage,
} from "../../utils/common";
import {
  InitContactsDetails,
  InitContactsMessage,
  InitRosterContacts,
  InsertHistoryMessage,
  InsertIntoRoster,
  InsertNewMessage,
  RemoveGroupParticipants,
  RemoveMessageFrom,
  ResetState,
  UpdateGroupParticipants,
  UpdateMessageMarker,
  UpdateUserPresence,
  setFocus,
  setGroupSubject,
} from "../../store/actions/contactAction";
import {
  addToRoster,
  changeRoomSubject,
  extractJIDs,
  getRoomDetails,
  queryHistoryMessages,
  queryUserRoster,
  removeFromRoster,
} from "../../api/query";
import ChatLayout from "./Layout";
import useEventHandler from "../../hooks/useEventHandler";
import { ResetUI } from "../../store/actions/managerAction";
import AuthError from "../../components/AuthError";
import Profile from "../Profile";

const Chat = ({
  contact,
  manager,
  InitContactsDetails,
  InitRosterContacts,
  InitContactsMessage,
  InsertIntoRoster,
  InsertHistoryMessage,
  setFocus,
  setGroupSubject,
  InsertNewMessage,
  UpdateMessageMarker,
  UpdateUserPresence,
  UpdateGroupParticipants,
  RemoveGroupParticipants,
  ResetUI,
  ResetState,
  RemoveMessageFrom,
}) => {
  //
  const [chatDataLoading, setChatDataLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const { isOnline } = useInternetConnection();

  const connection = useXMPP(manager.user?.jid, manager.user?.token);

  const onHistoryMessage = (messages, lastId) => {
    // Remove From Roster if no message exist with JID
    contact.roster?.forEach((jid) => {
      if (!Object.keys(messages).includes(jid)) {
        console.log("Unnecessary Roster");
        // removeFromRoster(connection, jid);
      }
    });

    // Global State -> contact -> "message"
    InitContactsMessage(messages);
    setChatDataLoading(false);
  };

  const onRosterSuccess = (rosters) => {
    // Global State -> contact -> "roster"
    InitRosterContacts(rosters);
    const gRoster = [];
    for (let i = 0; i < rosters.length; i++) {
      const jid = rosters[i];
      isGroup(jid) && gRoster.push(jid);
    }
    console.log(gRoster);

    getRoomDetails(connection, gRoster, manager.user?.username, (res) => {
      console.log("logging res");
      console.log(res);
      const groupContactDetails = {};
      Object.keys(res).forEach((gid) => {
        const roomRoster = generateRoomRoster(gid, res[gid]["subject"], res[gid]["participants"]);
        groupContactDetails[gid] = roomRoster;
      });
      // Global State -> contact -> "groups"
      InitContactsDetails(groupContactDetails);

      // Query all rosters history messages
      queryHistoryMessages(connection, rosters, onHistoryMessage, 100);
    });
  };
  const onRosterFailure = (st) => {
    // Show error to user
    showNotificationMessage("error", "Error Fetching Roster !");
    console.error(st);
  };

  const onContactSuccess = (res, req) => {
    const contacts_details = res?.data;
    // Global State -> contact -> "individual"
    InitContactsDetails(contacts_details);
    queryUserRoster(connection, onRosterSuccess, onRosterFailure);
  };
  const onContactFailure = (err) => {
    // Show error to use
    if (err.response?.status) {
      showNotificationMessage("error", "Error Fetching Contacts !");
    }
    console.error(err);
  };

  /* PRE FETCH ENTRY FOR DATA BINDING */

  const preFetch = () => {
    // Fetch contacts from API
    fetchContacts(onContactSuccess, onContactFailure, () => {});
  };

  useEffect(() => {
    // Connected to XMPP
    if (connection?.connected) {
      // Pre-Fetch
      preFetch();
    } else {
      console.log("Not Connected");
    }
  }, [connection]);

  const onRefreshGroupName = ({ detail }) => {
    console.log("Group Subject Refresh Triggered");
    const { room, participants } = detail;
    if (!contact.details[room]?.hasSubject) {
      const mod_participants = extractJIDs(participants);
      const subject = getGeneralGroupName(mod_participants, contact.details, manager.user);
      console.log(subject, participants);
      setGroupSubject({ room, subject });
    }
  };

  const chatFocusChangeHandler = ({ detail }) => {
    const jid = detail["jid"];
    setFocus(jid);
    if (!isGroup(jid)) {
      if (contact.message[jid]?.length > 0) {
        contact.message[jid].forEach((m) => {
          if (m["receipt"] !== 2 && m["from"] !== Strophe.getBareJidFromJid(connection.jid)) {
            UpdateMessageMarker({ receipt: 2, mid: m["id"], from: m["from"] });
            connection.message.displayed(m["from"], m["id"]);
          }
        });
      }
    } else {
      connection.muc.prep(jid, manager.user.username);
    }
  };

  const newChatMessageHandler = ({ detail }) => {
    const { m } = detail;
    if (!isGroup(m["from"])) {
      InsertNewMessage({ type: "in", message: m });
      connection.message.received(m["from"], m["id"]);
      if (m["from"] === contact.focus) {
        connection.message.displayed(m["from"], m["id"]);
        //
        window.dispatchEvent(
          new CustomEvent("update-chat-marker", { detail: { receipt: 2, mid: m["id"], from: m["from"] } })
        );
      }
      if (!contact.roster.includes(m["from"])) {
        InsertIntoRoster(m["from"]);
      }
    } else {
      m["from"] = Strophe.getBareJidFromJid(m["from"]);
      if (Strophe.getResourceFromJid(m["from"]) !== manager.user?.username) {
        InsertNewMessage({ type: "in", message: m });
        if (!contact.roster.includes(m["from"])) {
          InsertIntoRoster(m["from"]);
        }
      } else {
        InsertNewMessage({ type: "out", message: m });
      }
    }
  };

  const chatMarkerChangeHandler = ({ detail }) => {
    const { receipt, mid, from } = detail;
    if (!isGroup(from)) {
      UpdateMessageMarker({ receipt, mid, from });
    }
  };

  const onUserPresenceHandler = ({ detail }) => {
    const { from, status } = detail;
    UpdateUserPresence({ from, status });
  };

  const onAuthSuccess = () => {
    console.log("AUTH SUCCESS");
    setAuthError(false);
  };

  const onAuthFailure = () => {
    console.log("AUTH FAILED");
    setAuthError(true);
  };

  const onLogout = () => {
    console.log("USER LOGOUT");
    ResetUI();
    ResetState();
  };

  const onUserStatusChange = ({ detail }) => {
    const { status } = detail;
    console.log(status);
  };

  const onQueryHistoryMessageSuccess = (r) => {
    const jid = Object.keys(r)?.at(0);
    let history_message = [];
    if (jid) {
      history_message = [...r[jid]];
      InsertHistoryMessage({ _with: jid, message: history_message });
    } else {
      console.log(`Invalid History Message Query ${JSON.stringify(r)}`);
    }
    window.dispatchEvent(
      new CustomEvent("fetch-user-history-loaded", {
        detail: { jid, history_message },
      })
    );
  };

  const onQueryHistoryMessage = ({ detail }) => {
    const { _with, lastId, max } = detail;
    queryHistoryMessages(connection, [_with], onQueryHistoryMessageSuccess, max, lastId);
  };

  const onOutgoingMessage = ({ detail }) => {
    const { message } = detail;
    const dm = parseMessage(message);
    InsertNewMessage({ type: "out", message: dm });
    if (!contact.roster.includes(dm["to"])) {
      if (!isGroup(dm["to"])) {
        connection.roster.subscribe(dm["to"]);
      }
      InsertIntoRoster(dm["to"]);
    }
  };

  const onUpdateGroupSubject = ({ detail }) => {
    const { subject, room } = detail;

    const onSuccess = (subject) => {
      setGroupSubject({ room, subject });
      window.dispatchEvent(new CustomEvent("update-group-subject/response", { detail: { status: "SUCCESS" } }));
    };
    const onFailure = () => {
      window.dispatchEvent(new CustomEvent("update-group-subject/response", { detail: { status: "FAILURE" } }));
    };
    changeRoomSubject(connection, room, subject, onSuccess, onFailure);
  };

  const onGroupInvite = ({ detail }) => {
    const { room } = detail;

    const onJoinSuccess = (groupContactDetails) => {
      console.log("JOINED ROOM", room);
      const inviteMessage = `${getUserName(manager.user)} Joined`;
      connection.message.send(room, "groupchat", "info", inviteMessage);
      // Global State -> contact -> "groups"
      InitContactsDetails(groupContactDetails);
      addToRoster(
        connection,
        room,
        (s) => console.log(s),
        (e) => console.log("ADD TO ROSTER ERROR", e)
      );
    };

    getRoomDetails(connection, [room], manager.user?.username, (res) => {
      console.log(res);
      const groupContactDetails = {};
      const roomRoster = generateRoomRoster(room, res[room]["subject"], res[room]["participants"]);
      groupContactDetails[room] = roomRoster;

      connection.muc.prep(
        room,
        manager.user.username,
        (s) => {
          console.log("connect invite room", s);
          onJoinSuccess(groupContactDetails);
        },
        (e) => {
          console.log("connect invite error", e);
        }
      );
    });
  };

  const onDeleteRoom = ({ detail }) => {
    const { room } = detail;
    if (contact.focus === room) {
      setFocus(null);
    }
    removeFromRoster(connection, room);
    RemoveMessageFrom(room);
  };

  const onUpdateGroupParticipant = ({ detail }) => {
    const { jid, affiliation, room } = detail;
    let isJIDAlready = false;
    contact.details[room]?.participants.forEach((d) => {
      if (d["jid"] === jid && d["affiliation"] === affiliation) {
        isJIDAlready = true;
      }
    });
    if (!isJIDAlready) {
      console.log("Update Triggered");
      UpdateGroupParticipants({ room: room, data: { jid, affiliation, data: contact.details[jid] } });
    }
  };

  const onDeleteGroupParticipant = ({ detail }) => {
    const { jid, affiliation, room } = detail;
    console.log("Delete Triggered");
    RemoveGroupParticipants({ room, data: { jid, affiliation } });
    if (jid === manager.user?.jid) {
      window.dispatchEvent(new CustomEvent("delete-room", { detail: { room } }));
    }
  };

  const onIncomingSubjectChange = ({ detail }) => {
    const { room, subject, hasSubject } = detail;
    setGroupSubject({ room, subject, hasSubject });
  };

  useEventHandler("new-group-invite", onGroupInvite);
  useEventHandler("new-chat-message", newChatMessageHandler);
  useEventHandler("out-chat-message", onOutgoingMessage);

  useEventHandler("update-chat-marker", chatMarkerChangeHandler);
  useEventHandler("update-user-presence", onUserPresenceHandler);
  useEventHandler("update-chat-focus", chatFocusChangeHandler);
  useEventHandler("update-user-status", onUserStatusChange);
  useEventHandler("update-group-subject", onUpdateGroupSubject);

  useEventHandler("auth-chat-failure", onAuthFailure);
  useEventHandler("auth-chat-success", onAuthSuccess);
  useEventHandler("auth-chat-logout", onLogout);

  useEventHandler("fetch-user-history-message", onQueryHistoryMessage);
  useEventHandler("update-group-participant", onUpdateGroupParticipant);
  useEventHandler("delete-group-participant", onDeleteGroupParticipant);
  useEventHandler("delete-room", onDeleteRoom);

  useEventHandler("refresh-group-name", onRefreshGroupName);
  useEventHandler("incoming-subject-change", onIncomingSubjectChange);

  if(manager.isProfileCompleted === false) {
    return <Profile />
  }
  if (isOnline) {
    if (authError) {
      return <AuthError />;
    }
    if (chatDataLoading && !authError) {
      return <ChatLoading />;
    } else {
      return <ChatLayout connection={connection} />;
    }
  } else return <NetworkInterrupt />;
};

function mapStateToProps(state) {
  const { manager, contact } = state;
  return { manager, contact };
}

const mapDispatchToProps = {
  InitContactsDetails: InitContactsDetails,
  InitRosterContacts: InitRosterContacts,
  InitContactsMessage: InitContactsMessage,
  InsertNewMessage: InsertNewMessage,
  InsertIntoRoster: InsertIntoRoster,
  InsertHistoryMessage: InsertHistoryMessage,
  UpdateMessageMarker: UpdateMessageMarker,
  UpdateUserPresence: UpdateUserPresence,
  UpdateGroupParticipants: UpdateGroupParticipants,
  RemoveGroupParticipants: RemoveGroupParticipants,
  setFocus: setFocus,
  setGroupSubject: setGroupSubject,
  ResetUI: ResetUI,
  ResetState: ResetState,
  RemoveMessageFrom: RemoveMessageFrom,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
