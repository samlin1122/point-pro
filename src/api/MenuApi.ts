import http from "./http";
import { GetMenuResponse } from "~/types/api";

export const getMenu = () => {
  return http.get<string, GetMenuResponse>("/menu");
};
