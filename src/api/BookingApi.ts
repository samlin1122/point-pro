import { GetPeriodsResponse, PostReservationPayload, PostReservationResponse } from "~/types/api";
import http from "./http";

export const getAvailablePeriods = () => {
  return http.get<string, GetPeriodsResponse>("period");
};

export const createBooking = (payload: PostReservationPayload) => {
  return http.post<string, PostReservationResponse>("reservation", payload);
};
