import { _Add, _Sub } from "../reducers/counterReducer";
import { createDispatch } from "./common";

const Add = (payload) => {
  return (dispatch) => createDispatch(dispatch, _Add, payload);
};

const Sub = (payload) => {
  return (dispatch) => createDispatch(dispatch, _Sub, payload);
};

export { Add, Sub };
