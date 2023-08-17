import api from ".";
import { store } from "../store/store";

export const login = (
  data = null,
  onSuccess = () => {},
  onFailure = () => {},
  onEnd = () => {}
) => {
  api
    .post("/login", { ...data, domain: window.location.hostname })
    .then(onSuccess)
    .catch(onFailure)
    .finally(onEnd);
};

export const fetchContacts = (
  onSuccess = () => {},
  onFailure = () => {},
  onEnd = () => {}
) => {
  const { manager } = store.getState();
  api
    .get("/contacts", {
      headers: { Authorization: `Bearer ${manager.token}` },
    })
    .then(onSuccess)
    .catch(onFailure)
    .finally(onEnd);
};

export const updateUserProfile = (values) => {
  values["domain"] = window.location.hostname;
  const { manager } = store.getState();
  return api.patch("/update-profile", values, {
    headers: { Authorization: `Bearer ${manager.token}` },
  });
};


export const upload = (imageInfo, to_, message_id) => {
  const { manager } = store.getState();
  try {
    const formData = new FormData();
    formData.append("file", imageInfo.file.originFileObj);
    formData.append("to_", to_);
    formData.append("message_id", message_id);

    return api.post("/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${manager.token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
