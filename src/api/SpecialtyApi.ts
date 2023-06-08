import http from "./http";
import {
  Id,
  SpecialtiesResponse,
  SpecialtyResponse,
  PostSpecialtyPayload,
  PutSpecialtyById,
  SpecialtyItemsResponse
} from "~/types/api";

export const getSpecialties = () => {
  return http.get<string, SpecialtiesResponse>("specialty");
};

export const getSpecialtyById = (specialtyId: Id) => {
  return http.get<string, SpecialtyResponse>(`specialty/${specialtyId}`);
};

export const postSpecialty = (payload: PostSpecialtyPayload) => {
  return http.post<string, SpecialtyResponse>("specialty", payload);
};

export const putSpecialtyById = ({ specialtyId, payload }: PutSpecialtyById) => {
  return http.put<string, SpecialtyResponse>(`specialty/${specialtyId}`, payload);
};

export const deleteSpecialty = (specialtyId: Id) => {
  return http.delete<string, SpecialtyResponse>(`specialty/${specialtyId}`);
};
export const getSpecialtyItems = () => {
  return http.get<string, SpecialtyItemsResponse>("specialty/specialtyItems");
};
