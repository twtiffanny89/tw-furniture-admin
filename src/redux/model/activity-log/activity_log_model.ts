import { paginationModel } from "../global-model/pagination_model";

export interface ActivityLogListModel {
  data: activityLog[];
  pagination: paginationModel | null;
}

interface activityLog {
  id: string;
  userId: string;
  deviceToken: string;
  latitude: string;
  longitude: string;
  versionLabel: string;
  deviceName: string;
  deviceType: string;
  physicalDevice: boolean;
  osVersion: string;
  clientIP: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface User {
  id: string;
  username: string;
  firstName: any;
  lastName: any;
  role: string;
  active: boolean;
  phoneNumber: string;
  updatedAt: string;
  image: Image;
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}
