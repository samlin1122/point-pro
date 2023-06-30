import http from "./http";
import { SeatsPayload, SeatsResponse, SeatByIdPayload } from "~/types/api";

export const getSeats = (params: SeatsPayload) => {
  return http.get<string, SeatsResponse>("seat", { params });
};
export const getSeatById = ({ seatId, date }: SeatByIdPayload) => {
  return http.get<string, SeatsResponse>(`seat/${seatId}`, { params: { date } });
};
