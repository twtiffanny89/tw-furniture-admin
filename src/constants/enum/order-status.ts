export enum OrderStatus {
  PENDING = "PENDING",
  STORE_ACCEPTED = "STORE_ACCEPTED",
  PROCESSING = "PROCESSING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURN = "RETURN",
  SYSTEM_CANCELED = "SYSTEM_CANCELED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  ALL = "ALL",
}

export enum FilterOrderStatus {
  PROCESS = "PROCESS",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
  ALL = "ALL",
}

export const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];
