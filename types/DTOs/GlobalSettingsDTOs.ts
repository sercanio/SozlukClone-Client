import { GetAllResponse } from './BaseDTOs';
import { AuthorGroupGetByIdResponse } from './AuthorGroupsDTOs';

export interface GlobalSetting {
  id: number;
  siteName: string;
  siteDescription: string;
  siteFavIcon: string | null;
  siteLogo: string | null;
  siteLogoFooter: string | null;
  siteLogoMobile: string | null;
  maxTitleLength: number | null;
  defaultAuthorGroupId: number;
  defaultAuthorGroup?: AuthorGroupGetByIdResponse;
  isAuthorRegistrationAllowed: boolean | undefined;
  maxEntryLength: number | null;
}

export interface GlobalSettingsGetAllResponse extends GetAllResponse<GlobalSetting> {}

export interface GlobalSettingsGetByIdResponse extends GlobalSetting {}

export interface GlobalSettingsUpdateRequest {
  id: number;
  siteName?: string;
  siteDescription?: string;
  siteFavIcon?: string | null;
  siteLogo?: string | null;
  siteLogoFooter?: string | null;
  siteLogoMobile?: string | null;
  maxTitleLength?: number | null;
  defaultAuthorGroupId?: number ;
  isAuthorRegistrationAllowed?: boolean | undefined;
  maxEntryLength?: number | null;
}
