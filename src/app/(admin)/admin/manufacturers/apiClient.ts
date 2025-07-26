import apiClient from "@/services/manufacturers/apiclient";

const uploadImageToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("images", file); // Field name must match "images"
  formData.append("folder", "manufacturers"); // Optional folder parameter

  const response = await apiClient.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.urls[0];
};

export { apiClient };
