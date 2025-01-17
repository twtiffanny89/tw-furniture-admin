import { paginationModel } from "../global/pagination_model";

export interface OrderListModel {
  data: OrderDetailModel[];
  pagination: paginationModel | null;
}

export interface OrderDetailModel {
  id: string;
  noted: string;
  userId: string;
  addressId: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliverySchedule: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  deliveryStatusHistory: DeliveryStatusHistory[];
  user: User;
  items: ProductOrderModel[];
}

interface Address {
  id: string;
  customerName?: string;
  phoneNumber?: string;
  houseNo: string;
  streetName: string;
  village: string;
  additionalNoted?: string;
  commune: string;
  district: string;
  cityProvince: string;
  country: string;
  lat: number;
  lng: number;
  combinedString: string;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  image: Image[];
}

interface Image {
  fileName: string;
  id: string;
  imageUrl: string;
}

interface DeliveryStatusHistory {
  id: string;
  orderId: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  image?: Image;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
  gender?: string;
  role: string;
  isActive: boolean;
}

interface ProductOrderModel {
  id: string;
  orderId: string;
  variantId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: string;
  discount?: Discount;
  variant: Variant;
}

interface Discount {
  id: string;
  totalPriceAfterDiscount: number;
  formattedTotalPriceAfterDiscount: string;
  priceAfterDiscount: number;
  formattedPriceAfterDiscount: string;
  price: number;
  formattedPrice: string;
  discount: number;
  formatDiscountType: string;
  orderItemId: string;
}

interface Variant {
  id: string;
  productId: string;
  price: string;
  discount?: string;
  discountType: string;
  discountStartDate?: string;
  discountEndDate?: string;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image[];
}
