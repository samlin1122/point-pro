import http from "./http";
import {
  GenerateTokenPayload,
  GenerateTokenResponse,
  GetUserInfoResponse,
  LoginPayload,
  LoginResponse
} from "~/types/api";

export const postLogin = (payload: LoginPayload) => {
  return http.post<string, LoginResponse>("auth/login", payload, { withCredentials: true });
};

export const getUserInfo = () => {
  return http.get<string, GetUserInfoResponse>("auth/user-info");
};

export const generateToken = (payload: GenerateTokenPayload) => {
  return http.post<string, GenerateTokenResponse>("auth/token", payload);
};
