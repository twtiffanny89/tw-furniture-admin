"use server";

import { FileImageUpload } from "@/redux/model/global/file-Image-upload";
import { axiosServerWithAuth } from "@/utils/api/axios_server";
import axios from "axios";

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
  name?: string;
  description?: string;
  basePrice?: number;
  subcategoryId?: string;
  isPublic?: boolean;
}

interface AttributeValue {
  attributeValueId: string;
  name: string;
}

interface PostData {
  attributeValues: AttributeValue[];
  attributeId: string;
}

interface editProduct {
  data: createProductParams;
  productId: string;
}

interface addAttributeModel {
  productId: string;
  data: PostData;
}

interface remoceAttributeModel {
  productId: string;
  attributeId: string;
}

interface addAttributeValueImageModel {
  productId: string;
  data: PostImageData;
}

interface addMainImageModel {
  productId: string;
  data: ImageUpload;
}

interface ImageUpload {
  fileContent?: string;
  fileExtension: string;
  imageId?: string;
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
  data: toId;
}

interface addVariantValue {
  variantId: string;
  attributeValueId: string;
  attributeId: string;
}

interface removeVariantModel {
  variantId: string;
}

interface removeAttribudeModel {
  productId: string;
  data: removeAttribute;
}

interface updateStatusAttribudeValueModel {
  productAttributeToValueId: string;
  data: updateAttributeValue;
}

interface updateAttributeValue {
  isPublic: boolean;
}

interface removeAttribute {
  attributeValueId: string;
  attributeId: string;
}

interface removeProductSuggestion {
  productId: string;
  data: toId;
}

interface toId {
  toId: string;
}

interface addVariantImageModel {
  variantId: string;
  data: FileImageUpload;
}

interface addVariantModel {
  productId: string;
  data: addVariant;
}

interface editVariantModel {
  variantId: string;
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
  limit = 10,
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

// Get All
export async function getAllProductPromotionService({
  page = 1,
  limit = 10,
  search = "",
}: getAllProductParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/product/discount?page=${page}&limit=${limit}&search=${search}`
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message:
            "This product name is already in use. Please choose a different name.",
        };
      }
      return {
        success: false,
        message: "Failed to create product. Please try again.",
      };
    }
  }
  return {
    success: false,
    message: "Failed to create product. Please try again.",
  };
}

export async function uploadMainImageProductService({
  productId,
  data,
}: addMainImageModel) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/product-image`,
      data
    );
    return {
      success: true,
      message: "Product image upload successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to upload Product image. Please try again!",
    };
  }
}

// Create product
export async function editProductService({ productId, data }: editProduct) {
  try {
    const response = await axiosServerWithAuth.patch(
      `/v1/admin/product/${productId}`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Product edit successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to edit Product. Please try again!",
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

export async function getProductPreviewByIdService({
  productId,
}: getByProductIdModel) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/product/${productId}/preview`
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
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-attribute`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Attribute product add successfully!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message:
            "This Attribute is already in product. Please choose a different name.!",
        };
      }
      return {
        success: false,
        message: "Failed to add Attribute product. Please try again!",
      };
    }
  }
  return {
    success: false,
    message: "Failed to add Attribute product. Please try again!",
  };
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

export async function removeAttributeProductService({
  productId,
  attributeId,
}: remoceAttributeModel) {
  try {
    await axiosServerWithAuth.delete(
      `/v1/admin/product/${productId}/remove-attribute/${attributeId}`
    );
    return {
      success: true,
      message: "Attribute remove successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to remove Attribute. Please try again!",
    };
  }
}

export async function addVariantProductService({
  data,
  productId,
}: addVariantModel) {
  try {
    console.log("### data", data);
    console.log("### productId", productId);
    const response = await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/add-variant`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Variant add successfully!",
    };
  } catch (e) {
    console.log("### e", e.response.data);
    return {
      success: false,
      message: "Failed to add Variant. Please try again!",
    };
  }
}

export async function updateVariantProductService({
  data,
  variantId,
}: editVariantModel) {
  try {
    const response = await axiosServerWithAuth.patch(
      `/v1/admin/product/${variantId}/update-variant`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Variant updated successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to updated Variant. Please try again!",
    };
  }
}

export async function removeVariantProductService({
  variantId,
}: removeVariantModel) {
  try {
    await axiosServerWithAuth.delete(
      `/v1/admin/product/remove-variant/${variantId}`
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

export async function removeAttribudeValueProductService({
  productId,
  data,
}: removeAttribudeModel) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/remove-attribute-value`,
      data
    );
    return {
      success: true,
      message: "Deleted attribute variant successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to Deleted attribute variant. Please try again!",
    };
  }
}

export async function updateStatusAttribudeValueProductService({
  productAttributeToValueId,
  data,
}: updateStatusAttribudeValueModel) {
  try {
    await axiosServerWithAuth.patch(
      `/v1/admin/product/update-attribute-value/${productAttributeToValueId}`,
      data
    );
    return {
      success: true,
      message: "Updated status attribute variant successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to Update status attribute variant. Please try again!",
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

export async function delelteVariantImageValueProductService(imageId: string) {
  try {
    const response = await axiosServerWithAuth.delete(
      `/v1/admin/product/variant-image/${imageId}`
    );
    return {
      success: true,
      data: response.data.data,
      message: "Variant image deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete Variant image. Please try again!",
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message:
            "This Suggestion product is already taken. Please choose a different name.!",
        };
      }
      return {
        success: false,
        message: "Failed to add Suggestion product. Please try again!",
      };
    }
  }
  return {
    success: false,
    message: "Failed to add Suggestion product. Please try again!",
  };
}

export async function deleteProductSuggestionService({
  data,
  productId,
}: removeProductSuggestion) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/product/${productId}/remove-product-suggestion`,
      data
    );
    return {
      success: true,
      message: "Suggestion product deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted Suggestion product. Please try again!",
    };
  }
}
