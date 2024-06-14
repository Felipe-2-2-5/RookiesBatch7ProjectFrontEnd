import { httpClient } from "../httpClient/httpClient";

export const LoginUser = async (body) => {
  try {
    const response = await httpClient.post("/login", body);
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    return error;
  }
};

export const FilterRequest = async (body) => {
  const response = await httpClient.post("/users/filter", body);
  return response;
};

export const GetDetailedUser = async (id) => {
    const response = await httpClient.get(`/users/${id}`)
    return response.data;
}
