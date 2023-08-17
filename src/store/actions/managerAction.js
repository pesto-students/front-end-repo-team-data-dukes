import { _AuthorizeUI, _ResetUI } from "../reducers/managerReducer";
import { createDispatch } from "./common";

const AuthorizeUI = (payload) => {
  return (dispatch) => createDispatch(dispatch, _AuthorizeUI, payload);
};

const ResetUI = (payload) => {
  return (dispatch) => createDispatch(dispatch, _ResetUI, payload);
};

export { AuthorizeUI, ResetUI };
