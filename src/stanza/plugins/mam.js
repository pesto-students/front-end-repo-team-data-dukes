/* XEP-0313: Message Archive Management
 *
 */
import { Strophe, $iq } from "strophe.js";
import { config } from "../../config/config";

Strophe.addConnectionPlugin("mam", {
  _c: null,
  _p: ["with", "start", "end"],
  init: function (conn) {
    this._c = conn;
    Strophe.addNamespace("MAM", "urn:xmpp:mam:2");
  },

  query: function (jid, options) {
    var _p = this._p;
    var attr = {
      type: "set",
      id: jid,
    };

    if (options["with"].includes(config["groupKey"])) {
      attr.to = options["with"]; // Add 'to' key with the value of 'jid'
    }

    var mamAttr = { xmlns: Strophe.NS.MAM };
    var iq = $iq(attr);

    if (!options["with"].includes(config["groupKey"])) {
      iq = iq.c("query", { xmlns: "urn:xmpp:mam:2" });
    } else {
      iq = iq.c("query", mamAttr).c("x", { xmlns: "jabber:x:data" });
      iq.c("field", { var: "FORM_TYPE", type: "submit" }).c("value").t("urn:xmpp:mam:2").up().up();
      for (let i = 0; i < this._p.length; i++) {
        var pn = _p[i];
        var p = options[pn];
        delete options[pn];
        if (!!p) {
          iq.c("field", { var: pn }).c("value").t(p).up().up();
        }
      }
      iq.up();
    }

    var onMessage = options["onMessage"];
    delete options["onMessage"];
    var onComplete = options["onComplete"];
    delete options["onComplete"];
    iq.cnode(new Strophe.RSM(options).toXML());

    const h = this._c.addHandler(onMessage, Strophe.NS.MAM, "message", null);
    this._c.sendIQ(iq, (s) => {
      this._c.deleteHandler(h);
      onComplete(s);
    });
  },
});
