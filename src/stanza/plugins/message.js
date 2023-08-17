/* XEP-0022: Message
 *
 */
import { Strophe, $msg } from "strophe.js";
import { generate_id } from "../utils";

Strophe.addConnectionPlugin("message", {
  _c: null,

  init: function (conn) {
    this._c = conn;
    Strophe.addNamespace("ACK", "urn:xmpp:chat-markers:0");
  },

  send: function (jid, type, mtype, message, message_id = null) {
    const m = $msg({
      id: message_id ? message_id : generate_id(),
      type: type,
      to: jid,
      from: Strophe.getBareJidFromJid(this._c.jid),
      messageType: mtype,
      datetime: new Date().toISOString(),
    });

    if (mtype !== "info" && type !== "groupchat") {
      m.c("markable", { xmlns: Strophe.NS.ACK }).up();
    }

    if (mtype === "text" || mtype === "info") {
      m.c("body", {}).t(message);
    } else if (mtype === "gif") {
      m.c("body", {}).c("img", {
        src: message["url"],
        width: message["width"],
        height: message["height"],
      });
    } else if (mtype === "img") {
      m.c("body", {}).c("img", {
        src: message["url"],
      });
    } else if (mtype === "doc") {
      m.c("body", {}).c("doc", {
        src: message["url"],
        name: message["name"],
        size: message["size"],
      });
    }
    this._c.send(m);
    if (type === "chat") {
      window.dispatchEvent(
        new CustomEvent("out-chat-message", {
          detail: { message: m.tree() },
        })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("out-groupchat-message", {
          detail: { message: m.tree() },
        })
      );
    }

    return m.tree();
  },

  received: function (to, mid) {
    const ack = $msg({ id: generate_id(), type: "reply", to: to }).c("received", {
      xmlns: Strophe.NS.ACK,
      id: mid,
    });
    this._c.send(ack);
  },

  displayed: function (to, mid) {
    const ack = $msg({ id: generate_id(), type: "reply", to: to }).c("displayed", {
      xmlns: Strophe.NS.ACK,
      id: mid,
    });
    this._c.send(ack);
  },
});
