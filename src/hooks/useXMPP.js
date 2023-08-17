import { useState, useEffect, useRef } from "react";
import { Strophe } from "strophe.js";

import "../stanza/plugins/roster";
import "../stanza/plugins/rsm";
import "../stanza/plugins/mam";
import "../stanza/plugins/muc";
import "../stanza/plugins/presence";
import "../stanza/plugins/message";
import "../stanza/plugins/ping";
import { useSelector } from "react-redux";

import { isGroup, isUserPresence, parseMarkerMessage, parseMessage } from "../utils/common";
import { config } from "../config/config";

// const url = `${config["url"]}${config["path"]}?token=${config["token"]}`;

const useXMPP = (username, password) => {
  const url = `${config["url"]}${config["path"]}`;
  const [connection, setConnection] = useState(null);
  const pingRef = useRef(null);
  const { manager } = useSelector((state) => state);

  function onChatMessage(message) {
    const m = parseMessage(message);
    window.dispatchEvent(new CustomEvent("new-chat-message", { detail: { m } }));
    return true;
  }

  

  function onGroupChatMessage(message) {
    console.log("GROUP Message", message);
    const subject = message.querySelector("subject");
    if (!subject) {
      const m = parseMessage(message);
      const body = message.querySelector("body");
      if (body) {
        window.dispatchEvent(new CustomEvent("new-chat-message", { detail: { m } }));
      }
    } else {
      const actualSubject = subject?.innerHTML;
      console.log("SUBJECT : ", actualSubject);
      if (actualSubject.trim() !== "") {
        window.dispatchEvent(
          new CustomEvent("incoming-subject-change", {
            detail: {
              subject: actualSubject,
              room: Strophe.getBareJidFromJid(message.getAttribute("from")),
              hasSubject: true,
            },
          })
        );
      }
    }
    return true;
  }

  function onChatMarker(message) {
    const { receipt, mid, from } = parseMarkerMessage(message);
    window.dispatchEvent(new CustomEvent("update-chat-marker", { detail: { receipt, mid, from } }));
    return true;
  }

  function onPresence(presence) {
    const from = Strophe.getBareJidFromJid(presence.getAttribute("from"));

    if (from) {
      // Non Group Presence
      if (!isGroup(from)) {
        const p = isUserPresence(presence);
        if (p) {
          const { from, status } = p;
          window.dispatchEvent(new CustomEvent("update-user-presence", { detail: { from, status } }));
        } else {
          console.log("INDIVIDUAL -> Untraced Presence : ", presence);
        }
      }
      // Group Presence
      else {
        const room = Strophe.getBareJidFromJid(presence.getAttribute("from"));
        const destroy = presence.querySelector("destroy");
        const groupNotFound = presence.querySelector("item-not-found");
        const item = presence.querySelector("item");

        // Remove Room Actions
        if (destroy || groupNotFound) {
          console.log("Destroy Room");
          window.dispatchEvent(new CustomEvent("delete-room", { detail: { room } }));
        }
        // Room Participants Action
        else if (item) {
          console.log("Participant Presence", item);
          const jid = Strophe.getBareJidFromJid(item.getAttribute("jid"));
          const affiliation = item.getAttribute("affiliation");
          const role = item.getAttribute("role");
          // Check this
          if (role !== "none") {
            console.log(jid, affiliation, room)
            window.dispatchEvent(new CustomEvent("update-group-participant", { detail: { jid, affiliation, room } }));
          } else if (role === "none") {
            window.dispatchEvent(new CustomEvent("delete-group-participant", { detail: { jid, affiliation, room } }));
          } else if (presence.getAttribute("id") && presence.getAttribute("id") === "exit-room") {
            window.dispatchEvent(new CustomEvent("delete-group-participant", { detail: { jid, affiliation, room } }));
          } else {
            console.log("Untraced Participant Presence", presence);
          }
        }
        // Unknown action
        else {
          console.log("GROUP -> Untraced Presence : ", presence);
        }
      }
    } else {
      console.log("UNKNOWN -> Untraced Presence : ", presence);
    }
    return true;
  }

  function onInviteMessage(message) {
    const x = message.querySelector("x");
    if (x) {
      const room = x.getAttribute("jid");
      window.dispatchEvent(new CustomEvent("new-group-invite", { detail: { room } }));
    } else {
      console.log("Untraced Invite Message", message);
    }
    return true;
  }

  const pinger = (conn) => {
    if (conn?.connected) {
      conn.ping.ping(
        config["unit_url"],
        (s) => console.log("ping..."),
        (e) => console.error("ping error : ", e),
        () => {
          if (manager?.isAuthorized && !manager.authError) {
            retryConnection(conn);
          }
        }
      );
    } else {
      if (manager?.isAuthorized && !manager.authError) {
        retryConnection(conn);
      }
    }
  };

  useEffect(() => {
    clearInterval(pingRef);
    if (connection?.connected) {
      pingRef.current = setInterval(() => pinger(connection), 10000);
    }
    return () => clearInterval(pingRef.current);
  }, [connection]);

  function retryConnection(conn) {
    setTimeout(() => {
      conn.connect(username, password, (status) => {
        onConnect(conn, status);
      });
    }, 5000);
  }


  function onConnect(conn, status) {
    if (status === Strophe.Status.CONNECTED) {
      console.log("Connected to XMPP server");
      window.dispatchEvent(new CustomEvent("auth-chat-success", {}));

      // Handlers
      conn.addHandler(onGroupChatMessage, null, "message", "groupchat");
      conn.addHandler(onChatMessage, null, "message", "chat");
      conn.addHandler(onChatMarker, null, "message", "reply");
      conn.addHandler(onInviteMessage, null, "message", "invite");
      conn.addHandler(onPresence, null, "presence");

      conn.presence.send("chat");
      setConnection(conn);
    } else if (status === Strophe.Status.AUTHFAIL) {
      window.dispatchEvent(new CustomEvent("auth-chat-failure", {}));
    } else if (status === Strophe.Status.DISCONNECTED) {
      console.log("Disconnected from XMPP server");
      setTimeout(() => {
        conn.connect(username, password, onConnect);
      }, 3000);
    } else if (status === Strophe.Status.CONNFAIL) {
      console.log("XMPP connection error");
      if (manager?.isAuthorized && !manager?.authError) {
        retryConnection(conn);
      } else {
        console.log("XMPP connection error (NoRetry)");
      }
    }
  }

  useEffect(() => {
    const conn = new Strophe.Connection(url);
    // conn.connect("chat.unit001.ap-south-1.dev-vc9.nouveau-labs.in", null, (status) => {
    //   onConnect(conn, status);
    // });
    conn.connect(username, password, (status) => {
      onConnect(conn, status);
    });
    return () => {
      conn.disconnect();
    };
  }, []);

  return connection;
};

export default useXMPP;
