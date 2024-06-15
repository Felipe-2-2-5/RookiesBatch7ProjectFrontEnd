import { httpClient } from "../httpClient/httpClient";

export const LoginUser = async (body) => {
  try {
    const response = await httpClient.post("/users/login", body);
    return response;
  } catch (error) {
    return error;
  }
};
export const ChangePassword = async (body) => {
  try {
    const response = await httpClient.post("/users/change_password", body);
    return response;
  } catch (error) {
    return error;
  }
};
export const FilterRequest = async (body) => {
  const response = await httpClient.post("/users/filter", body);
  return response;
};

export const GetDetailedUser = async (id) => {
  const response = await httpClient.get(`/users/${id}`);
  return response.data;
};
