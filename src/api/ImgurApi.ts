import http from "./http";
import { updateImgPayload, updateImgResponse } from "~/types/api";

export const uploadImg = (payload: updateImgPayload) => {
  return http.post<string, updateImgResponse>("imgur", payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
