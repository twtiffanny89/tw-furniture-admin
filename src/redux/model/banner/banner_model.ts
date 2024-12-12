import { paginationModel } from "../global/pagination_model";

export interface BannerListModel {
  data: BannerModel[];
  pagination: paginationModel | null;
}

export interface BannerModel {
  id: string;
  bannerType: string;
  fileName: string;
  imageUrl: string;
}
