/* XEP-0022: Message
 *
 */
import { Strophe, $pres } from "strophe.js";

Strophe.addConnectionPlugin("presence", {
  _c: null,

  init: function (conn) {
    this._c = conn;
  },

  send: function (show, status = null) {
    const p = $pres({ "xml:lang": "en" }).c("show", {}).t(show).up();
    if (status) {
      p.c("status", {}).t(status);
    }
    this._c.send(p.tree());
  },
});
