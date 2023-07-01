import { PeriodsResponse } from "~/types/api";
import http from "./http";

export const getPeriods = () => {
  return http.get<string, PeriodsResponse>("period/list");
};

export const getPeriodByDate = (params?: any) => {
  return http.get<string, PeriodsResponse>("period", { params });
};
