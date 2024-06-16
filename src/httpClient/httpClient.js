import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7083/api",
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
      if (err.response.status > 400) {
        if (err.response.status === 401) {
          window.location.href = "/login";
          alert("You are not authorized to access this resource");
          localStorage.removeItem("token");
          return Promise.reject(err.response.data);
        } else if (err.response.status === 403) {
          alert("You don't have permission to access this resource");
          return Promise.reject(err.response.data);
        } else if (err.response.status === 404) {
          alert("Resource not found");
          return Promise.reject(err.response.data);
        } else {
          alert(
            "An error occured while processing your request. Please try again later."
          );
        }
      }
    } catch (error) {
      alert(
        "An error occured while processing your request. Please try again later."
      );
      return Promise.reject(error.response.data);
    }
  }
);

export const httpClient = instance;
