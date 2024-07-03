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

export const ExportReport = async () => {
  try {
    const response = await httpClient.post("/assets/report/export", {}, {
      responseType: 'blob', // Important for binary data
    });

    // Create a URL for the blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Get the filename from the response headers if available
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'AssetReport.xlsx';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link); // Remove the link after downloading
    window.URL.revokeObjectURL(url); // Free up memory
  } catch (error) {
    console.error('Error downloading report:', error);
  }
};