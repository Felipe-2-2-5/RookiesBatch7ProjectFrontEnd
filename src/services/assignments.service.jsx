import { httpClient } from "../httpClient/httpClient";

export const FilterAssignment = async (body) => {
  const response = await httpClient.post("assignments/filter", body);
  return response;
};
export const GetAssignment = async (id) => {
  const response = await httpClient.get(`assignments/${id}`);
  return response.data;
};

export const CreateAssignmentAPI = async (body) => {
  const response = await httpClient.post("/assignments", body);
  return response;
};

export const EditAssignmentAPI = async (id, body) => {
  const response = await httpClient.put(`/assignments/${id}`, body);
  return response.data;
};

export const GetMyAssignments = async (body) => {
  const response = await httpClient.post("/assignments/my-assignments", body);
  return response.data;
};

export const AcceptRespondAPI = async (id) => {
  console.log(id);
  var acceptState = { state: 0 };
  try {
    await httpClient.put(`/assignments/${id}/respond`, acceptState);
  } catch (error) {
    console.error("Error in AcceptRespondAPI:", error);
    throw error;  // Re-throw the error after logging it
  }
}

export const DeclineRespondAPI = async (id) => {
  var declineState = { state: 2 };
  await httpClient.put(`/assignments/${id}/respond`, declineState)
}
