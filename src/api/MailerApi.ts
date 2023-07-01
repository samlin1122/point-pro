import { MailerRequestBody } from "~/types/api";
import http from "./http";

export const sendMailRequest = (payload: MailerRequestBody) => {
  return http.post<string, string>(`/mail`, payload);
};
