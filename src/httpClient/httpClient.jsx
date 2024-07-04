import axios from "axios";
import { EventEmitter } from "events";

export const popupEventEmitter = new EventEmitter();

// const baseURL = "https://test1-team2rookiesbatch7.azurewebsites.net/api";
const baseURL = "https://localhost:7083/api";

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
    return { data: res?.data, status: res?.status, headers: res?.headers };
  },
  async (err) => {
    let errorMessage =
      "An error occurred while processing your request. Please try again later.";
    if (err?.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = "You are not authorized to access this resource.";
          localStorage.removeItem("token");
          popupEventEmitter.emit("showPopup", errorMessage);
          break;
        case 404:
          errorMessage = "Resource not found.";
          popupEventEmitter.emit("showPopup", errorMessage);
          break;
        case 500:
          errorMessage =
            "An error occurred while processing your request. Please try again later.";
          popupEventEmitter.emit("showPopup", errorMessage);
          break;
        default:
          errorMessage = err.response.data;
          break;
      }
    }
    return Promise.reject(errorMessage);
  }
);

export const httpClient = instance;
