import http from "./http";
import {
  Id,
  SpecialtiesResponse,
  SpecialtyResponse,
  PostSpecialtyPayload,
  PatchSpecialtyByIdPayload,
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

export const patchSpecialtyById = ({ specialtyId, payload }: PatchSpecialtyByIdPayload) => {
  return http.patch<string, SpecialtyResponse>(`specialty/${specialtyId}`, payload);
};

export const deleteSpecialty = (specialtyId: Id) => {
  return http.delete<string, SpecialtyResponse>(`specialty/${specialtyId}`);
};
export const getSpecialtyItems = () => {
  return http.get<string, SpecialtyItemsResponse>("specialty/specialtyItems");
};
