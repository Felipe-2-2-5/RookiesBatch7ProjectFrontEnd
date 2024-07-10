import { httpClient } from "../httpClient/httpClient";

export const LoginUser = async (body) => {
  const response = await httpClient.post("/users/login", body);
  return response;
};

export const ChangePassword = async (body) => {
  const response = await httpClient.post("/users/change_password", body);
  return response;
};

export const FilterRequest = async (body) => {
  const response = await httpClient.post("/users/filter", body);
  return response;
};

export const FilterRequestForEdit = async (id, body) => {
  const response = await httpClient.post(`/users/filter-choosing/${id}`, body);
  return response;
};

export const GetUsers = async () => {
  const response = await httpClient.get("/users");
  return response;
};

export const GetUser = async (id) => {
  const response = await httpClient.get(`/users/${id}`);
  return response;
};

export const CreateUserAPI = async (body) => {
  const response = await httpClient.post("/users", body);
  return response;
};

export const UpdateUser = async (id, body) => {
  const response = await httpClient.put(`/users/${id}`, body);
  return response;
};
export const DisableUser = async (id) => {
  const response = await httpClient.put(`/users/disable/${id}`);
  return response;
};
