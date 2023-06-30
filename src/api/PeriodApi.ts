import { PeriodsResponse } from "~/types/api";
import http from "./http";

export const getPeriods = (params?: any) => {
  return http.get<string, PeriodsResponse>("period", { params });
};
