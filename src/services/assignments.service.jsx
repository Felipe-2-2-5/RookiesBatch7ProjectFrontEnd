import { httpClient } from "../httpClient/httpClient";

export const FilterAssignment = async (body) => {
  const response = await httpClient.post("assignments/filter", body);
  console.log(body);
  return response;
};
export const GetAssignment = async (id) => {
  const response = await httpClient.get(`assignments/${id}`);
  return response;
};

export const CreateAssignmentAPI = async (body) => {
  const response = await httpClient.post("/assignments", body);
  console.log(response);
  return response;
}

