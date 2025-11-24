import axios from "axios";
import { store} from "../redux/store";
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

export const getProfile = async () => {
  return await apiHelper("GET", "/web/profile");
};

export const updateProfile = async (data) => {
  return await apiHelper("POST", "/web/profile/update", {}, data);
};

export const deleteProfile = async () => {
  return await apiHelper("DELETE", "/web/profile/delete");
};

export const getBudgetRequests = async (status) => {
  return await apiHelper("GET", `/web/fleet/budget-requests?status=${status}`);
};

export const manageBudgetRequest = async (data) => {
  return await apiHelper("POST", "/web/fleet/budget-request/manage", {}, data);
};

export const getServiceBookings = async (status, search = "") => {
  const params = new URLSearchParams({ status });
  if (search) params.append('search', search);
  return await apiHelper("GET", `/web/service-bookings?${params.toString()}`);
};

export const getServiceBookingDetails = async (id) => {
  return await apiHelper("GET", `/web/service-booking/${id}`);
};

export const getMechanics = async (status, search = "") => {
  const params = new URLSearchParams({ status });
  if (search) params.append('search', search);
  return await apiHelper("GET", `/web/shop/mechanics?${params.toString()}`);
};

export const createMechanic = async (data) => {
  return await apiHelper("POST", "/web/shop/mechanic/create", {}, data);
};

export const getProducts = async () => {
  return await apiHelper("GET", "/web/shop/products");
};

export const addProduct = async (data) => {
  return await apiHelper("POST", "/web/shop/product/store", {}, data);
};

export const getProductDetails = async (id) => {
  return await apiHelper("GET", `/web/shop/product/${id}`);
};

export const updateProduct = async (data) => {
  return await apiHelper("POST", "/web/shop/product/update", {}, data);
};

export const deleteProduct = async (id) => {
  return await apiHelper("DELETE", `/web/shop/product/delete?product_id=${id}`);
};

export const getProductRequests = async () => {
  return await apiHelper("GET", "/web/shop/product/requests");
};

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

