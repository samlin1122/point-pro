import http from "./http";
import {
  Id,
  ReservationsResponse,
  ReservationResponse,
  PostReservationPayload,
  PatchReservationPayload
} from "~/types/api";

export const getReservations = (date: Date) => {
  return http.get<string, ReservationsResponse>("reservation", { params: { date: date ?? new Date() } });
};

export const postReservation = (payload: PostReservationPayload) => {
  return http.post<string, ReservationsResponse>("reservation", payload);
};

export const getReservationById = (reservationId: Id) => {
  return http.get<string, ReservationResponse>(`reservation/${reservationId}`);
};

export const patchReservationById = ({ reservationId, payload }: PatchReservationPayload) => {
  return http.patch<string, ReservationsResponse>(`reservation/${reservationId}`, payload);
};
