import { axiosService } from "./axios";
import { MediaUploadResponse, MediaDetails } from "./types";

class MediaService {
  async upload(file: File, folder?: string): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    const response = await axiosService.post<MediaUploadResponse>("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getDetails(publicId: string): Promise<MediaDetails> {
    const response = await axiosService.get<MediaDetails>("/media/details", {
      params: { publicId },
    });
    return response.data;
  }

  async getUrl(publicId: string): Promise<{ url: string }> {
    const response = await axiosService.get<{ url: string }>("/media/url", {
      params: { publicId },
    });
    return response.data;
  }
}

export const mediaService = new MediaService();
