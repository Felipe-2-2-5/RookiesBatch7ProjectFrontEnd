import { httpClient } from "../httpClient/httpClient";

export const GetReturnRequest = async (id) => {
    const response = await httpClient.get(`/return-requests/${id}`);
    return response;
};

export const ReturnRequestFilterRequest = async (body) => {
    const response = await httpClient.post("/return-requests/filter", body);
    return response;
};