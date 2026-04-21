import { axiosService } from "./axios";
import { WebsiteSettings, UpdateWebsiteSettingsRequest } from "./types";

class WebsiteSettingService {
  async get(): Promise<WebsiteSettings> {
    // Lay cau hinh website hien tai tu backend.
    const response = await axiosService.get<WebsiteSettings>("/website-settings");
    return response.data;
  }

  async update(data: UpdateWebsiteSettingsRequest): Promise<WebsiteSettings> {
    // Cap nhat cau hinh website voi cac gia tri duoc cung cap.
    const response = await axiosService.patch<WebsiteSettings>("/website-settings", data);
    return response.data;
  }
}

export const websiteSettingService = new WebsiteSettingService();
