import axios from "axios";
import { store } from "../redux/store";
import { setLogout } from "../redux/userslice";
import { toast } from "react-toastify";
import { getCookie, deleteCookie } from "../utils";

const instance = axios.create({
  baseURL: "https://server1.appsstaging.com/rigrescue/api/v1",
  // baseURL: "https://client1.appsstaging.com:3017/api/v1/",

  timeout: 20000,
});

instance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token || getCookie("token");
    console.log("Token in interceptor:", token, getCookie("token") );
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    console.error("API Error:", message);
    if (typeof message === "string") {
      if (
          message.includes("Unauthorized") ||
          message.includes("Invalid session token") ||
          message.includes("Unauthenticated")
          
        ) {
        store.dispatch(setLogout());
        deleteCookie("token");
        window.location.href = "/";
        return Promise.reject(message);
      }
    }

    return Promise.reject(message || "Something went wrong. Please try again.");
  }
);


export const apiHelper = async (
  method,
  endPoint,
  customHeaders = {},
  body = null,
  customConfig = {}
) => {
  try {
    const isFormData = body instanceof FormData;
    const config = {
      method,
      url: endPoint,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...customHeaders,
      },
      ...(method !== "GET" && body != null ? { data: body } : {}),
      ...customConfig,
    };

    const response = await instance.request(config);
    return {
      error: null,
      response,
    };
  } catch (error) {
    return {
      error:
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong.",
      response: null,
    };
  }
};

