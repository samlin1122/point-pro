import { PeriodsResponse } from "~/types/api";
import http from "./http";

export const getPeriods = () => {
  return http.get<string, PeriodsResponse>("period");
};
export const getPeriodByDate = (date: Date) => {
  return http.get<string, PeriodsResponse>("period", { params: { date: date ?? new Date() } });
};
