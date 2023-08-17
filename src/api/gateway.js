import axios from "./index";
import { store } from "../store/store";

export const upload_to_s3 = (imageInfo, to_, message_id) => {
  const { manager } = store.getState();
  try {
    const formData = new FormData();
    formData.append("file", imageInfo.file.originFileObj);
    formData.append("to_", to_);
    formData.append("message_id", message_id);

    return axios.post("/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${manager.token}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
