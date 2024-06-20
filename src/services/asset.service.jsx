import { httpClient } from "../httpClient/httpClient"

export const AssetFilterRequest = async (body) => {
  const response = await httpClient.post("/assets/filter", body);
  console.log(response);
  return response;
}

export const GetAsset = async (id) => {
  const response = await httpClient.get(`/assets/${id}`);
  return response;
};
export const CreateAssetAPI = async (body) => {
  const response = await httpClient.post("/assets", body);
  return response;
};
