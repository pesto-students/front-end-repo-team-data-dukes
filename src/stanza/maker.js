import { Strophe, $iq, $pres, $build, $msg } from "strophe.js";
import { generate_id } from "./utils";

/* User Related */

export const getPresence = (toGetUserJID) => {
  return $pres({
    to: toGetUserJID,
  });
};

export const sendPresence = (status) => {
  return $pres({ name: "xml:lang", value: "en" }).c("show", {}).t(status).tree();
};

export const subscribe = (subscribeToJID) => {
  return $pres({
    type: "subscribe",
    to: subscribeToJID,
  });
};

export const getRoster = () => {
  return $iq({
    id: "get-roster",
    type: "get",
  }).c("query", { xmlns: "jabber:iq:roster" });
};

/* Group Related */

export const acceptGroupInvite = (groupJID, nickname) => {
  return Strophe.xmlElement("presence", { to: `${groupJID}/${nickname}` }, [
    Strophe.xmlElement("x", { xmlns: "http://jabber.org/protocol/muc" }, null),
  ]);
};

export const sendInviteToGroup = (groupJID, inviteJID) => {
  return Strophe.xmlElement("message", { to: groupJID, id: "invite-group" }, [
    Strophe.xmlElement("x", { xmlns: "http://jabber.org/protocol/muc#user" }, [
      Strophe.xmlElement("invite", { to: inviteJID }, null),
    ]),
  ]);
};

export const getGroupOccupants = (groupJID) => {
  return Strophe.xmlElement("iq", { type: "get", id: `get-group-occupants`, to: groupJID }, [
    Strophe.xmlElement("query", { xmlns: "http://jabber.org/protocol/muc#admin" }, [
      Strophe.xmlElement("item", { affiliation: "member" }),
    ]),
  ]);
};

export const createGroup = (groupJID, nickname) => {
  return Strophe.xmlElement(
    "presence",
    {
      to: `${groupJID}/${nickname}`,
      id: `create-group`,
    },
    [Strophe.xmlElement("x", { xmlns: "http://jabber.org/protocol/muc" })]
  );
};

export const configureGroup = (groupJID) => {
  return $iq({
    to: groupJID,
    type: "set",
    id: `configure-group`,
  })
    .c("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
    .c("x", { xmlns: "jabber:x:data", type: "submit" });
};

export const deleteGroup = (groupJID) => {
  return $iq({
    to: groupJID,
    type: "set",
    id: `delete-group`,
  })
    .c("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
    .c("destroy")
    .c("reason")
    .t("destroyed");
};

export const grantGroupMembership = (groupJID, participants) => {
  var aff = participants.map(function (d) {
    return $build("item", {
      affiliation: "member",
      jid: d.jid,
      nick: d.username,
    }).c("reason", {}, "Added to Room as Member !");
  });

  return $iq({
    id: "grant-group-membership",
    to: groupJID,
    type: "set",
  })
    .c("query", { xmlns: "http://jabber.org/protocol/muc#admin" })
    .cnode(aff)
    .tree();
};

export const revokeGroupMembership = (groupJID, toRemoveUserJID) => {
  return $iq({
    id: "revoke-group-membership",
    to: groupJID,
    type: "set",
  })
    .c("query", { xmlns: "http://jabber.org/protocol/muc#admin" })
    .c("item", {
      affiliation: "none",
      jid: toRemoveUserJID,
    })
    .tree();
};

export const exitGroup = (groupJID) => {
  return Strophe.xmlElement(
    "presence",
    {
      to: `${groupJID}`,
      type: "unavailable",
      id: "exit-group",
    },
    [
      Strophe.xmlElement("x", { xmlns: "http://jabber.org/protocol/muc#user" }, [
        Strophe.xmlElement("item", { role: "none" }),
      ]),
    ]
  );
};

export const signalGroupPresence = (groupJID, nickname) => {
  return Strophe.xmlElement(
    "presence",
    {
      id: "signal-group-presence",
      to: `${groupJID}/${nickname}`,
    },
    [Strophe.xmlElement("x", { xmlns: "http://jabber.org/protocol/muc" }, null)]
  );
};

export const changeGroupSubject = (groupJID, subject) => {
  return Strophe.xmlElement(
    "message",
    {
      id: "change-group-subject",
      to: groupJID,
      type: "groupchat",
    },
    [Strophe.xmlElement("subject", {}, subject)]
  );
};

export const addGroupToRoster = (groupJID) => {
  return Strophe.xmlElement("iq", { type: "set", id: `set-group-roster` }, [
    Strophe.xmlElement("query", { xmlns: "jabber:iq:roster" }, [
      Strophe.xmlElement("item", { jid: groupJID, subscription: "both" }, [Strophe.xmlElement("group", {}, groupJID)]),
    ]),
  ]);
};

export const removeGroupFromRoster = (groupJID) => {
  return Strophe.xmlElement("iq", { type: "set", id: "remove-group-roster" }, [
    Strophe.xmlElement("query", { xmlns: "jabber:iq:roster" }, [
      Strophe.xmlElement("item", { jid: groupJID, subscription: "remove" }, null),
    ]),
  ]);
};

export const queryGroupMessage = (groupJID, lastId = null, maxMessages = 20) => {
  const iq = $iq({
    type: "set",
    id: "query-group-message",
    to: groupJID,
  })
    .c("query", { xmlns: "urn:xmpp:mam:2" })
    .c("set", { xmlns: "http://jabber.org/protocol/rsm" })
    .c("max", {}, maxMessages);

  if (lastId) {
    iq.c("before", {}, lastId);
  }
  return iq.tree();
};

export const queryUserMessage = (userJID, lastId = null, maxMessages = 20) => {
  const query = $build("query", { xmlns: "urn:xmpp:mam:2" })
    .c("x", { xmlns: "jabber:x:data", type: "submit" })
    .c("field", { var: "FORM_TYPE", type: "hidden" })
    .c("value", {}, "urn:xmpp:mam:2")
    .up()
    .c("field", { var: "with" })
    .c("value", {}, userJID)
    .up()
    .up()
    .c("set", { xmlns: "http://jabber.org/protocol/rsm" });

  if (lastId) {
    query.c("before", {}, lastId).up();
  }

  query.c("max", {}, maxMessages).up().c("flip-page", {}, null);

  const iq = $iq({
    type: `set`,
    id: `query-user-message`,
  }).cnode(query.tree());

  return iq.tree();
};
