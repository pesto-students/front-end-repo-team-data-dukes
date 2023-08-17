import { message, notification } from "antd";
import { Strophe } from "strophe.js";
import { store } from "../store/store";
import { extractJIDs } from "../api/query";
import { config } from "../config/config";


export const remove_undefined = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};

export const flipflopem = (data) => {
  if (data["email_id"]) {
    delete data["mobile_no"];
  } else if (data["mobile_no"]) {
    delete data["email_id"];
  }
  return data;
};

export const showNotification = (type, message, description) => {
  notification.config({ duration: 5 });
  notification[type]({ message, description });
};

export const showNotificationMessage = (type, content) => {
  message.config({ duration: 5 });
  message[type]({ content: <span className="fw-600">{content}</span> });
};

export const capitalizeFirstLetter = (string) => {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
};

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatDateMessage = (datetime) => {
  const date = new Date(datetime);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseInt((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const download = (base64, filename) => {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const toDataUrl = (url, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
};

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
};

export const isGroup = (jid) => {
  return jid.includes(config["groupKey"]);
};

export const parseMessage = (msg) => {
  let id = msg.getAttribute("id");

  // if msg in group -> full JID else Bare JID
  let from = msg.getAttribute("from");
  let user = Strophe.getResourceFromJid(from);
  if (!isGroup(msg.getAttribute("from"))) {
    user = Strophe.getNodeFromJid(msg.getAttribute("from"));
    from = Strophe.getBareJidFromJid(msg.getAttribute("from"));
  }

  const to = Strophe.getBareJidFromJid(msg.getAttribute("to"));
  const type = msg.getAttribute("type");
  const messageType = msg.getAttribute("messageType");
  const datetime = msg.getAttribute("datetime");

  let receipt = 0;
  if (msg.querySelector("received")) {
    receipt = 1;
  } else if (msg.querySelector("displayed")) {
    receipt = 2;
  }

  let content;
  if (messageType === "text" || messageType === "info") {
    content = msg.querySelector("body").innerHTML;
  } else if (messageType === "gif") {
    let url = msg.querySelector("img").getAttribute("src");
    let width = msg.querySelector("img").getAttribute("width");
    let height = msg.querySelector("img").getAttribute("height");
    content = { url, width, height };
  } else if (messageType === "img") {
    let url = msg.querySelector("img").getAttribute("src");
    content = { url };
  } else if (messageType === "doc") {
    let url = msg.querySelector("doc").getAttribute("src");
    let name = msg.querySelector("doc").getAttribute("name");
    let size = msg.querySelector("doc").getAttribute("size");
    content = { url, name, size };
  }
  return { id, from, to, type, messageType, datetime, receipt, content, user };
};

export const parseHistoryMessageToJson = (st) => {
  let fwd = st.querySelector("forwarded");
  let msg = fwd.querySelector("message");
  return parseMessage(msg);
};

export const parseMarkerMessage = (st) => {
  let receipt = 1;
  let mid = null;
  let from = Strophe.getBareJidFromJid(st.getAttribute("from"));
  let dmarker = st.querySelector("displayed");
  let rmarker = st.querySelector("received");
  if (dmarker) {
    receipt = 2;
    mid = dmarker.getAttribute("id");
  } else {
    mid = rmarker.getAttribute("id");
  }
  return { receipt, mid, from };
};

export const isUserPresence = (st) => {
  const from = Strophe.getBareJidFromJid(st.getAttribute("from"));
  const show = st.querySelector("show");
  const id = st.getAttribute("id");
  if (!id) {
    if (show) {
      const status = show.innerHTML;
      return { from, status };
    } else if (from && st.getAttribute("type")) {
      const status = st.getAttribute("type");
      return { from, status };
    }
  }
  return false;
};

export const genericGroupName = (participants) => {
  const flList = [];
  let fName;

  participants?.sort()?.forEach((p) => {
    const fname = p["data"]?.first_name;
    if (fname) {
      flList.push(fname);
    }
  });
  if (flList.length === 1) {
    fName = `${flList[0]}`;
  } else if (flList.length === 2) {
    fName = `${flList[0]} and ${flList[1]}`;
  } else if (flList.length === 3) {
    fName = `${flList[0]}, ${flList[1]} and ${flList[2]}`;
  } else {
    fName = `${flList[0]}, ${flList[1]} +${flList.length - 2}`;
  }
  return fName;
};

export const getGeneralGroupName = (participants, pDetails, user) => {
  const flList = [];
  let fName;

  participants?.sort()?.forEach((jid) => {
    if (jid !== user.jid) {
      const fname = pDetails[jid]?.first_name;
      flList.push(fname);
    }
  });
  if (flList.length === 0) {
    fName = `${user.first_name}`;
  } else if (flList.length === 1) {
    fName = `${flList[0]} and ${user.first_name}`;
  } else if (flList.length === 2) {
    fName = `${flList[0]}, ${flList[1]} and ${user.first_name}`;
  } else {
    fName = `${flList[0]}, ${flList[1]} +${flList.length - 2}`;
  }
  return fName;
};

export const generateRoomRoster = (roomJID, subject, participant) => {
  const gJid = roomJID;
  const gParticipant = extractJIDs(participant);
  let isCurrentUserOwner = false;

  // Get Global States
  const { manager, contact } = store.getState();
  const owner = manager.user;
  const pDetails = contact.details;

  let gFName = subject;

  // For Now Always NULL
  let gAvatar = null;
  let gLName = "";
  let hasSubject = false;

  if (gFName.trim() !== "") {
    hasSubject = true;
  } else {
    gFName = getGeneralGroupName(gParticipant, pDetails, owner);
    hasSubject = false;
  }

  participant.forEach((p) => {
    if (p.jid === owner.jid && p.affiliation === "owner") {
      isCurrentUserOwner = true;
    }
  });

  return {
    first_name: gFName,
    last_name: gLName,
    jid: gJid,
    avatar_url: gAvatar,
    participants: participant,
    isCurrentUserOwner: isCurrentUserOwner,
    hasSubject: hasSubject,
  };
};

export const getUserName = (detail) => {
  return `${capitalizeFirstLetter(detail?.first_name)} ${capitalizeFirstLetter(detail?.last_name)}`;
};

export const getAvatarImg = (detail) => {
  return detail?.first_name?.charAt(0).toUpperCase() + detail?.last_name?.charAt(0).toUpperCase();
};

export const createGenerateParticipants = (selected, current_user) => {
  const participants = [];
  participants.push({ jid: current_user?.jid, affiliation: "owner", data: current_user });
  selected.forEach((jid) => {
    participants.push({ jid: jid, affiliation: "member" });
  });
  return participants;
};
