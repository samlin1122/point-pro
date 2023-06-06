import http from "./http";
import { GetUserInfoResponse, LoginPayload, LoginResponse } from "~/types/api";

export const postLogin = (payload: LoginPayload) => {
  return http.post<string, LoginResponse>("auth/login", payload, { withCredentials: true });
};

export const getUserInfo = () => {
  return http.get<string, GetUserInfoResponse>("auth/user-info");
};
