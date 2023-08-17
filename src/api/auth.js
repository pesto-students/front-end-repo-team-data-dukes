import axios from "./index";
import { remove_undefined, flipflopem } from "../utils/common";

export const AuthLogin = (
  data,
  onSucess = () => {},
  onFailure = () => {},
  setLoading = () => {}
) => {
  setLoading(true);
  data["domain"] = window.location.hostname;
  data = remove_undefined(data);
  data = flipflopem(data);
  axios
    .post("/login", { ...data })
    .then((res, req) => {
      onSucess(res, req);
    })
    .catch(({ response, request }) => {
      onFailure(response, request);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const AuthRegister = (
  data,
  onSucess = () => {},
  onFailure = () => {},
  setLoading = () => {}
) => {
  setLoading(true);
  data = remove_undefined(data);
  data = flipflopem(data);

  data["domain"] = window.location.hostname;
  axios
    .post("/register", { ...data })
    .then((res, req) => {
      onSucess(res, req, data);
    })
    .catch(({ response, request }) => {
      onFailure(response, request, data);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const ValidID = (
  data,
  onSucess = () => {},
  onFailure = () => {},
  setLoading = () => {}
) => {
  setLoading(true);
  data["domain"] = window.location.hostname;
  data = remove_undefined(data);
  axios
    .get("/valid", { params: data })
    .then((res, req) => {
      onSucess(res, req, data);
    })
    .catch(({ response, request }) => {
      onFailure(response, request, data);
    })
    .finally(() => {
      setLoading(false);
    });
};
