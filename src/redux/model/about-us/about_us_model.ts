export interface AboutUsModel {
  id: string;
  description: string;
  location: string;
  phoneNumber: string;
  phoneStore: string;
  email: string;
  availableTime: string;
  showroomHours: string;
  websiteUrl: string;
  telegramUrl: string;
  messagerUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  createdAt: string;
  updatedAt: string;
  abaQrImageUrl: string;
  image: Image;
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}
