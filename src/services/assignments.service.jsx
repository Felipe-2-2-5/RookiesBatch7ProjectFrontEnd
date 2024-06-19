import { httpClient } from "../httpClient/httpClient";

export const FilterAssignment = async (body) => {
  const response = await httpClient.post("assignments/filter", body);
  return response;
};
