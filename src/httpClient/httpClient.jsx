import axios from "axios";

import { EventEmitter } from "events";

export const popupEventEmitter = new EventEmitter();

// const baseURL = "https://test1-team2rookiesbatch7.azurewebsites.net/api";

const baseURL = "https://localhost:7083/api";
// process.env.REACT_APP_API_BASE_URL || "https://localhost:7083/api";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    return { data: res?.data, status: res.status };
  },
  async (err) => {
    try {
      if (err?.response?.status >= 400) {
        let errorMessage = "";
        if (err.response.status === 401) {
          errorMessage = "You are not authorized to access this resource";
          localStorage.removeItem("token");
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to access this resource";
        } else if (err.response.status === 404) {
          errorMessage = "Resource not found";
        } else if (err.response.status === 500) {
          errorMessage = "An error occured while processing your request.";
        } else {
          errorMessage = err.response.data;
        }
        return Promise.reject(errorMessage);
      }
    } catch (error) {
      popupEventEmitter.emit(
        "showPopup",
        "An error occured while processing your request. Please try again later."
      );
      return Promise.reject(error.response.data.UserMessage);
    }
  }
);

export const httpClient = instance;
