import { GetPeriodsResponse } from "~/types/api"
import http from "./http"


export const getAvailablePeriods = ()=>{

    return http.get<string, GetPeriodsResponse>("period")
}