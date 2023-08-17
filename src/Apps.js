import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import useXMPP from "./hooks/useXMPP";
import { parseMessage, sendMessage, sendPresence } from "./stanza/maker";
import { Strophe } from "strophe.js";
import { oneToOneHandler } from "./handlers/one";

function Apps() {
  const url = "ws://100.64.203.221:5280/xmpp-websocket";
  const username = "michael@localhost";
  const password = "password";

  const connection = useXMPP(url, username, password);

  useEffect(() => {
    if (connection) {
      // connection.addHandler(iqHandler, null, "presence", null, null, null);
    }
  }, [connection]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// export default App;
