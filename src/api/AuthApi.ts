import http from "./http";
import { LoginPayload, LoginResponse } from "~/types/api";

export const postLogin = (payload: LoginPayload) => {
  return http.post<string, LoginResponse>("auth/login", payload, { withCredentials: true });
};
