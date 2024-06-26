import { httpClient } from "../httpClient/httpClient";

export const AssetFilterRequest = async (body) => {
  const response = await httpClient.post("/assets/filter", body);
  return response;
};

export const GetAssets = async () => {
  const response = await httpClient.get("/assets");
  return response;
};

export const GetAsset = async (id) => {
  const response = await httpClient.get(`/assets/${id}`);
  return response;
};

export const FilterRequest = async (body) => {
  const response = await httpClient.post("/assets/filter", body);
  return response;
};

export const CreateAssetAPI = async (body) => {
  const response = await httpClient.post("/assets", body);
  return response;
};
export const EditAssetAPI = async (id, body) => {
  const response = await httpClient.put(`/assets/${id}`, body);
  return response;
};
export const GetCategories = async () => {
  const response = await httpClient.get("/categories");
  return response;
};

export const DeleteAsset = async (id) => {
  const response = await httpClient.delete(`/assets/${id}`);
  return response;
};

//get all report with two parameter: sortColumn, sortDirection
export const FilterReport = async (body) => {
  const response = await httpClient.post("/assets/report", body);
  return response;
};
