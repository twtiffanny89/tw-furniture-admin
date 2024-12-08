import { paginationModel } from "../global/pagination_model";

export interface UserInfoListModel {
  data: UserInfoModel[];
  pagination: paginationModel | null;
}

interface UserInfoModel {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  image: Image;
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}
