import { httpClient } from "../httpClient/httpClient";

export const GetCategories = async (searchTerm) => {
  const response = await httpClient.post(`/categories/filter`, searchTerm);
  return response;
};
export const CreateCategoryAPI = async (body) => {
  const response = await httpClient.post("/categories", body);
  return response;
};
