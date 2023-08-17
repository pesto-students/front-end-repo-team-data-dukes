import {
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
} from "../reducers/contactReducer";
import { createDispatch } from "./common";

const setFocus = (payload) => {
  return (dispatch) => createDispatch(dispatch, _setFocus, payload);
};

const setGroupSubject = (payload) => {
  return (dispatch) => createDispatch(dispatch, _setGroupSubject, payload);
};

const InitContactsDetails = (payload) => {
  return (dispatch) => createDispatch(dispatch, _initContactsDetails, payload);
};

const InitGroupContacts = (payload) => {
  return (dispatch) => createDispatch(dispatch, _initGroupContacts, payload);
};

const InitRosterContacts = (payload) => {
  return (dispatch) => createDispatch(dispatch, _initRosterContacts, payload);
};

const InitContactsMessage = (payload) => {
  return (dispatch) => createDispatch(dispatch, _initContactsMessage, payload);
};

const InsertNewMessage = (payload) => {
  return (dispatch) => createDispatch(dispatch, _insertNewMessage, payload);
};

const InsertIntoRoster = (payload) => {
  return (dispatch) => createDispatch(dispatch, _insertIntoRoster, payload);
};

const InsertHistoryMessage = (payload) => {
  return (dispatch) => createDispatch(dispatch, _insertHistoryMessage, payload);
};

const InsertContactDetails = (payload) => {
  return (dispatch) => createDispatch(dispatch, _insertContactDetails, payload);
};

const UpdateMessageMarker = (payload) => {
  return (dispatch) => createDispatch(dispatch, _updateMessageMarker, payload);
};

const UpdateUserPresence = (payload) => {
  return (dispatch) => createDispatch(dispatch, _updateUserPresence, payload);
};

const UpdateGroupParticipants = (payload) => {
  return (dispatch) => createDispatch(dispatch, _updateGroupParticipants, payload);
};

const RemoveGroupParticipants = (payload) => {
  return (dispatch) => createDispatch(dispatch, _removeGroupParticipants, payload);
};

const RemoveFromRoster = (payload) => {
  return (dispatch) => createDispatch(dispatch, _removeFromRoster, payload);
};

const RemoveMessageFrom = (payload) => {
  return (dispatch) => createDispatch(dispatch, _removeMessagesFrom, payload);
};

const ResetState = (payload) => {
  return (dispatch) => createDispatch(dispatch, _resetState, payload);
};

export {
  setFocus,
  setGroupSubject,
  InitContactsDetails,
  InitGroupContacts,
  InitRosterContacts,
  InitContactsMessage,
  InsertNewMessage,
  InsertIntoRoster,
  InsertHistoryMessage,
  InsertContactDetails,
  UpdateMessageMarker,
  UpdateUserPresence,
  UpdateGroupParticipants,
  RemoveGroupParticipants,
  RemoveFromRoster,
  RemoveMessageFrom,
  ResetState,
};
