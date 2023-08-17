export const createDispatch = (dispatch, fn, payload) => {
  return dispatch(fn(payload));
};
