import axios from "axios";
import { EventEmitter } from "events";

export const popupEventEmitter = new EventEmitter();

const baseURL = "https://test1-team2rookiesbatch7.azurewebsites.net/api";

// const baseURL = "https://localhost:7083/api";

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
    return { data: res?.data, status: res?.status };
  },
  async (err) => {
    let errorMessage =
      "An error occurred while processing your request. Please try again later.";
    if (err?.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = "You are not authorized to access this resource.";
          localStorage.removeItem("token");
          break;
        case 404:
          errorMessage = "Resource not found.";
          break;
        case 500:
          errorMessage =
            "An error occurred while processing your request. Please try again later.";
          break;
        default:
          errorMessage = err.response.data;
          break;
      }
    }
    popupEventEmitter.emit("showPopup", errorMessage);
    return Promise.reject(err);
  }
);

export const httpClient = instance;
