import { PeriodsResponse } from "~/types/api";
import http from "./http";

export const getPeriods = () => {
  return http.get<string, PeriodsResponse>("period");
};
