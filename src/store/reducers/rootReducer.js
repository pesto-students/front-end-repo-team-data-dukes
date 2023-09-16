import { combineReducers } from "@reduxjs/toolkit";

import managerReducer from "./managerReducer";
import contactReducer from "./contactReducer";

export const rootReducer = combineReducers({
  manager: managerReducer,
  contact: contactReducer,
});
