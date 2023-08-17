import { createSlice } from "@reduxjs/toolkit";
import { genericGroupName } from "../../utils/common";

// Reducer Name
const name = "contact";

//Initial State
const initialState = {
  focus: null, // Focused Chat
  status: {}, // Presence Status
  details: {}, // Individual Contacts
  groups: {}, // Group Contacts
  roster: [], // Roster Contacts
  message: {}, // Messages
  hashMessage: {},
};

//Actions
const reducers = {
  _setFocus(state, action) {
    state["focus"] = action.payload;
  },
  _setGroupSubject(state, action) {
    const { room, subject, hasSubject } = action.payload;
    if (hasSubject) {
      state["details"][room] = { ...state["details"][room], first_name: subject, hasSubject: hasSubject };
    } else {
      state["details"][room] = { ...state["details"][room], first_name: subject };
    }
  },
  _initContactsDetails(state, action) {
    state["details"] = { ...state["details"], ...action.payload };
  },
  _initGroupContacts(state, action) {
    state["groups"] = action.payload;
  },
  _initRosterContacts(state, action) {
    state["roster"] = action.payload;
  },
  _initContactsMessage(state, action) {
    state["message"] = action.payload;
    Object.keys(action.payload).forEach((k) => {
      action.payload[k].forEach((m) => {
        state["hashMessage"][m["id"]] = true;
      });
    });
  },
  _insertNewMessage(state, action) {
    const { type, message } = action.payload;
    const sender = type === "out" ? "to" : "from";
    if (state["message"][message[sender]] && !state["hashMessage"][message["id"]]) {
      state["message"][message[sender]].push(message);
      state["hashMessage"][message["id"]] = true;
    } else if (!state["message"][message[sender]]) {
      state["message"][message[sender]] = [message];
      state["hashMessage"][message["id"]] = true;
    }
  },
  _insertIntoRoster(state, action) {
    if (!state.roster.includes(action.payload)) {
      state["roster"].push(action.payload);
    }
  },
  _insertHistoryMessage(state, action) {
    const { _with, message } = action.payload;
    if (state["message"][_with]) {
      state["message"][_with] = [...message, ...state["message"][_with]];
    } else {
      state["message"][_with] = [...message];
    }
  },
  _insertContactDetails(state, action) {
    const { jid, details } = action.payload;
    state["details"][jid] = details;
  },
  _updateMessageMarker(state, action) {
    const { receipt, mid, from } = action.payload;
    if (state["message"][from]) {
      state["message"][from].forEach((m, index) => {
        if (m["id"] === mid) {
          m["receipt"] = receipt;
          state["message"][from][index] = m;
        }
      });
    }
  },
  _updateUserPresence(state, action) {
    const { from, status } = action.payload;
    state["status"][from] = status;
  },
  _updateGroupParticipants(state, action) {
    const { room, data } = action.payload;
    const roomDetails = state.details[room];

    if (roomDetails && roomDetails.participants) {
      const newParticipants = roomDetails.participants.filter((d) => d.jid !== data.jid);
      state.details[room].participants = [...newParticipants, data];
      if (!state.details[room]?.hasSubject) {
        state.details[room].first_name = genericGroupName([...newParticipants, data]);
      }
    } else {
      state.details[room] = { participants: [data] };
      if (!state.details[room]?.hasSubject) {
        state.details[room].first_name = genericGroupName([data]);
      }
    }
  },
  _removeGroupParticipants(state, action) {
    const { room, data } = action.payload;
    const roomDetails = state.details[room];
    if (roomDetails && roomDetails.participants) {
      const newParticipants = roomDetails.participants.filter((d) => d.jid !== data.jid);
      state.details[room].participants = [...newParticipants];
      if (!state.details[room]?.hasSubject) {
        state.details[room].first_name = genericGroupName([...newParticipants]);
      }
    }
  },
  _removeFromRoster(state, action) {
    state["roster"] = state["roster"].filter((d) => d !== action.payload);
  },
  _removeMessagesFrom(state, action) {
    const new_messages = {};
    Object.keys(state["message"]).forEach((jid) => {
      if (jid !== action.payload) {
        new_messages[jid] = state["message"][jid];
      }
    });
    state["message"] = new_messages;
  },

  _resetState(state, action) {
    return initialState;
  },
};

//createSlice from reducers
const contactSlice = createSlice({
  name,
  initialState,
  reducers,
});

//Export Reducer Actions
export const {
  _setFocus,
  _setGroupSubject,
  _initContactsDetails,
  _initGroupContacts,
  _initRosterContacts,
  _initContactsMessage,
  _insertNewMessage,
  _insertIntoRoster,
  _insertHistoryMessage,
  _insertContactDetails,
  _updateMessageMarker,
  _updateUserPresence,
  _updateGroupParticipants,
  _removeGroupParticipants,
  _removeFromRoster,
  _removeMessagesFrom,
  _resetState,
} = contactSlice.actions;

//Export Reducer
export default contactSlice.reducer;
