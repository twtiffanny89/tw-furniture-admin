"use server";

import { FileImageUpload } from "@/redux/model/global/file-Image-upload";
import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getAllProductParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface getAllProductSuggestionParams {
  page?: number;
  limit?: number;
  productId?: string;
}

interface createProductParams {
  name: string;
  description?: string;
  basePrice?: number;
  subcategoryId: string;
}

interface AttributeValue {
  id: string;
  attributeId: string;
}

interface PostData {
  attributeValues: AttributeValue[];
  attributeId: string;
}

interface addAttributeModel {
  productId: string;
  data: PostData;
}

interface addAttributeValueImageModel {
  productId: string;
  data: PostImageData;
}

interface PostImageData {
  fileContent: string;
  fileExtension: string;
  attributeValueId: string;
  attributeId: string;
}

interface addVariantValueModel {
  productId: string;
  data: addVariantValue;
}

interface addProductSuggestModel {
  productId: string;
  data: suggestion;
}

interface suggestion {
  toId: string;
}

interface addVariantValue {
  variantId: string;
  attributeValueId: string;
  attributeId: string;
}

interface removeVariantModel {
  productId: string;
}

interface addVariantImageModel {
  variantId: string;
  data: FileImageUpload;
}

interface addVariantModel {
  productId: string;
  data: addVariant;
}

export interface addVariant {
  price: number;
  discount?: number;
  discountType?: string;
  discountStartDate?: string;
  discountEndDate?: string;
  stock?: number;
  sku?: string;
}

interface getByProductIdModel {
  productId: string;
}

// Get All
export async function getAllProductService({
  page = 1,
  limit = 15,
  search = "",
}: getAllProductParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/product?page=${page}&limit=${limit}&search=${search}`
    );
    return {
      data: response.data.data.data,
      pagination: response.data.data.pageInfo,
    };
  } catch {
    return {
      data: [],
      pagination: null,
    };
  }
}

// Create product
export async function createProductService(data: createProductParams) {
  try {
    const response = await axiosServerWithAuth.post("/v1/admin/product", data);
    return {
      success: true,
      data: response.data.data,
      message: "Product created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to created Product. Please try again!",
    };
  }
}

// Get product by ID
export async function getProductByIdService({
  productId,
}: getByProductIdModel) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/product/${productId}`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch {
    return {
      success: false,
      data: null,
    };
  }
}

export async function getProductSuggestionService({
  page = 1,
  limit = 15,
  productId,
}: getAllProductSuggestionParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/product/${productId}/get-suggestion?page=${page}&limit=${limit}`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch {
    return {
      success: false,
      data: null,
    };
  }
}

export async function addAttributeProductService({
  productId,
  data,
}: addAttributeModel) {
  console.log("### ===dataaaa", data);
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-attribute`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Attribute add successfully!",
    };
  } catch (e) {
    return {
      success: false,
      data: e,
      message: "Failed to add Attribute. Please try again!",
    };
  }
}

export async function addAttributeValueImageProductService({
  productId,
  data,
}: addAttributeValueImageModel) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/attribute-value-image`,
      data
    );
    return {
      success: true,
      message: "Attribute value image add successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to add Attribute value image. Please try again!",
    };
  }
}

export async function addVariantProductService({
  data,
  productId,
}: addVariantModel) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-variant`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Variant add successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to add Variant. Please try again!",
    };
  }
}

export async function removeVariantProductService({
  productId,
}: removeVariantModel) {
  try {
    await axiosServerWithAuth.delete(
      `/v1/admin/product/${productId}/remove-variant`
    );
    return {
      success: true,
      message: "Deleted variant successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to add Deleted. Please try again!",
    };
  }
}

export async function addVariantImageProductService({
  data,
  variantId,
}: addVariantImageModel) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/product/${variantId}/variant-image`,
      data
    );
    return {
      success: true,
      message: "Variant image add successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to add Variant image. Please try again!",
    };
  }
}

export async function addVariantValueProductService({
  data,
  productId,
}: addVariantValueModel) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-variant-value`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Variant value add successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to add Variant value. Please try again!",
    };
  }
}

export async function addProductSuggestionService({
  data,
  productId,
}: addProductSuggestModel) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-product-suggestion`,
      data
    );

    return {
      success: true,
      message: "Suggestion product added successfully!",
      data: response.data, // Include server response for additional context
    };
  } catch (error: any) {
    console.error("##Error adding product suggestion:", error); // Log for debugging

    return {
      success: false,
      error: error.response?.data || error.toString(), // Fixed typo from `test` to `error`
      message: "##Failed to add suggestion product. Please try again!",
    };
  }
}
