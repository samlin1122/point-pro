import axios, { AxiosRequestConfig } from "axios";

export const apiHost = import.meta.env.DEV ? import.meta.env.VITE_API_HOST_DEV : import.meta.env.VITE_API_HOST_PROD;

let http = axios.create({ baseURL: `${apiHost}/api` });

http.interceptors.request.use(
  (configs) => {
    let Token = sessionStorage.getItem("token");

    if (Token) {
      configs.headers.authorization = `Bearer ${Token}`;
    }
    return configs;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    log(response.config, response.data);
    return response.data;
  },
  // error
  (error) => {
    let { response } = error;
    log(response.config, response.data, true);
    errorCodeCheck(response.status);
    return Promise.reject(response);
  }
);

const errorCodeCheck = (status: number) => {
  switch (status) {
    case 401:
    case 403:
    case 500:
      if (location.href.includes("admin")) {
        sessionStorage.removeItem("token");
        location.replace(`${location.origin}/admin`);
      }
      break;
    default:
      break;
  }
};

function log({ method, url }: AxiosRequestConfig, text: string, error = false) {
  console.log(`%c ${method}/${url} `, `color: white; background-color: #${error ? "f66361" : "95B46A"}`, text);
}

export default http;
