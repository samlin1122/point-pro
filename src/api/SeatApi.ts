import http from "./http";
import { Id, SeatsPayload, SeatsResponse } from "~/types/api";

export const getSeats = (params: SeatsPayload) => {
  return http.get<string, SeatsResponse>("seat", { params });
};
export const getSeatById = (seatId: Id) => {
  return http.get<string, SeatsResponse>(`seat/${seatId}`);
};
