import http from "./http";
import { Id, ReservationsResponse, ReservationResponse, PostReservationPayload } from "~/types/api";

export const getReservations = () => {
  return http.get<string, ReservationsResponse>("reservation");
};

export const getReservationById = (reservationId: Id) => {
  return http.get<string, ReservationResponse>(`reservation/${reservationId}`);
};

export const postReservation = (payload: PostReservationPayload) => {
  return http.post<string, ReservationResponse>("reservation", payload);
};
