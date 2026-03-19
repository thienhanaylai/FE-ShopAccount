import { axiosService } from "./axios";
import { WebsiteSettings, UpdateWebsiteSettingsRequest } from "./types";

class WebsiteSettingService {
  async get(): Promise<WebsiteSettings> {
    const response = await axiosService.get<WebsiteSettings>("/website-settings");
    return response.data;
  }

  async update(data: UpdateWebsiteSettingsRequest): Promise<WebsiteSettings> {
    const response = await axiosService.patch<WebsiteSettings>("/website-settings", data);
    return response.data;
  }
}

export const websiteSettingService = new WebsiteSettingService();
