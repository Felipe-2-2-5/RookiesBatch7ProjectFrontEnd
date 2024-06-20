import { httpClient } from "../httpClient/httpClient"

export const AssetFilterRequest = async (body) => {
    const response = await httpClient.post("/assets/filter", body);
    console.log(response);
    return response;
}