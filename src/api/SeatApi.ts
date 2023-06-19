import http from "./http";
import { SeatsResponse } from "~/types/api";

export const getSeats = () => {
  return http.get<string, SeatsResponse>("seat");
};
