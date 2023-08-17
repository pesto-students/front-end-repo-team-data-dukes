import { parseHistoryMessageToJson, showNotificationMessage } from "../utils/common";
import { store } from "../store/store";
import { InsertIntoRoster, RemoveFromRoster } from "../store/actions/contactAction";
import { Strophe } from "strophe.js";

export const queryUserRoster = (conn, onSuccess = () => {}, onFailure = () => {}) => {
  conn?.roster.get((st) => {
    onSuccess(
      st.map((i) => {
        return i["jid"];
      })
    );
  }, onFailure);
};

export const queryHistoryMessages = (conn, jids, callback, max = 5, before = "", i = 0, results = {}) => {
  if (i < jids.length) {
    conn.mam.query(conn?.jid, {
      with: jids[i],
      max: max,
      before: before,
      onMessage: function (message) {
        const m = parseHistoryMessageToJson(message);
        if (!(jids[i] in results)) results[jids[i]] = [];
        if (m["receipt"] === 0 && m["from"] !== conn.jid && m["type"] === "chat") {
          conn.message.received(m["from"], m["id"]);
        }
        if (m["type"] === "groupchat") {
          m["from"] = Strophe.getBareJidFromJid(m["from"]);
        }
        results[jids[i]].push(m);
        return true;
      },
      onComplete: function (response) {
        queryHistoryMessages(conn, jids, callback, max, before, (i += 1), results);
      },
    });
  } else {
    callback(results);
  }
};

export const createRoom = (conn, roomName, nick, onSuccess, onFailure) => {
  conn.muc.prep(
    roomName,
    nick,
    (s) => {
      conn.muc.createInstantRoom(
        roomName,
        (s) => onSuccess(s, roomName),
        (e) => onFailure(e, "Error Creating Room !", roomName)
      );
    },
    (e) => {
      console.log("error", e);
      onFailure(e, "Error Initialising Room !", roomName);
    }
  );
};

export const addToRoster = (conn, jid, onSuccess = () => {}, onFailure = () => {}) => {
  conn.roster.add(
    jid,
    null,
    [],
    (s) => {
      store.dispatch(InsertIntoRoster(jid));
      onSuccess(s);
    },
    (e) => {
      showNotificationMessage("error", "Error Updating Roster !");
      onFailure(e);
    }
  );
};

export const removeFromRoster = (conn, jid, onSuccess = () => {}, onFailure = () => {}) => {
  conn.roster.remove(
    jid,
    (s) => {
      store.dispatch(RemoveFromRoster(jid));
      onSuccess(s);
    },
    onFailure
  );
};

export const extractJIDs = (array) => {
  return array.map(function (item) {
    return item.jid;
  });
};

const getRoomParticipants = (iq) => {
  const query = iq.querySelector("query");
  const { contact } = store.getState();
  const p = [];
  for (const child of query.children) {
    const t = {};
    t["jid"] = child.getAttribute("jid");
    t["affiliation"] = child.getAttribute("affiliation");
    t["data"] = contact.details[child.getAttribute("jid")];
    p.push(t);
  }
  return p;
};

export const getRoomDetails = (conn, jids, nick, callback, i = 0, results = {}) => {
  // On Room Subject
  const messageHandler = (msg) => {
    const subject = msg.querySelector("subject")?.innerHTML ? msg.querySelector("subject")?.innerHTML : "";
    conn.muc.getOccupants(jids[i], (iq) => {
      const participants = getRoomParticipants(iq);
      results[jids[i]] = { subject, participants };
      getRoomDetails(conn, jids, nick, callback, (i += 1), results);
    });
  };

  // Iterator
  if (i < jids.length) {
    conn.addHandler(messageHandler, null, "message", null);
    conn.muc.prep(jids[i], nick);
  } else {
    callback(results);
  }
};

export const changeRoomSubject = (conn, room, subject, onSuccess, onFailure) => {
  // On Room Subject
  const messageHandler = (msg) => {
    const subject = msg.querySelector("subject")?.innerHTML;
    if (subject) {
      onSuccess(subject);
    } else {
      onFailure();
    }
  };

  conn.addHandler(messageHandler, null, "message", null);
  conn.muc.setTopic(room, subject);
};

export const deleteRoom = (conn, room, onSuccess, onFailure) => {
  conn.muc.delete(room, null, (st) => onSuccess(st, room), onFailure);
};

export const addRoomAffiliation = (conn, room, participants) => {};
