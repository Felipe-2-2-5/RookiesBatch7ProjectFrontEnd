import { httpClient } from "../httpClient/httpClient";

export const GetReturnRequest = async (id) => {
  const response = await httpClient.get(`/return-requests/${id}`);
  return response;
};

export const ReturnRequestFilterRequest = async (body) => {
  const response = await httpClient.post("/return-requests/filter", body);
  return response;
};
export const CreateReturnRequest = async (assignmentId) => {
  const response = await httpClient.post(`/return-requests/${assignmentId}`);
  return response;
};
export const CancelReturnRequest = async (id) => {
  const response = await httpClient.delete(`/return-requests/${id}`);
  return response;
};
export const CompeleteReturnRequest = async (id) => {
  const response = await httpClient.put(`/return-requests/complete-requests/${id}`);
  return response;
};