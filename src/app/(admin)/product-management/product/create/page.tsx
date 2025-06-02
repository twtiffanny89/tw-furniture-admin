/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import { Switch } from "@/components/custom/Switch";
import DropDownSubCategory from "@/components/drop-down/drop-down-sub-dategory";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AddAttributeModal from "@/components/modal/add-attribude-modal";
import AddSuggestionModal from "@/components/modal/add-sugestion-modal";
import AddVarantsModal, {
  FormData,
} from "@/components/modal/add-variants-modal";
import ConfirmationModal from "@/components/modal/comfirmation-modal";
import Pagination from "@/components/pagination/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  attribudeHeader,
  productPreviewSuggestionHeader,
  variantsHeader,
} from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import { routed } from "@/constants/navigation/routed";
import {
  addAttributeProductService,
  addAttributeValueImageProductService,
  addProductSuggestionService,
  addVariant,
  addVariantImageProductService,
  addVariantProductService,
  addVariantValueProductService,
  createProductService,
  deleteProductSuggestionService,
  editProductService,
  getProductByIdService,
  getProductSuggestionService,
  updateStatusAttribudeValueProductService,
  updateVariantProductService,
  uploadMainImageProductService,
} from "@/redux/action/product-management/product-service";
import {
  createAttributeValueService,
  onUpdateSubAttribute,
} from "@/redux/action/product-management/sub-attribude-service";
import {
  getSubCategoryDetailService,
  getSubCategoryService,
} from "@/redux/action/product-management/sub_category_service";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import {
  MainValue,
  ProductDetailModel,
  Variant,
} from "@/redux/model/product/product-detail";
import { Product } from "@/redux/model/product/product-model";
import {
  ProductPreview,
  ProductPreviewListModel,
} from "@/redux/model/product/product-preview-model";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { config } from "@/utils/config/config";
import { convertToISOString } from "@/utils/date/convert_data";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";

const CreateProductComponent = () => {
  const [productDetail, setProductDetail] = useState<ProductDetailModel | null>(
    null
  );
  const [nameProduct, setNameProduct] = useState("");
  const [priceProduct, setPriceProduct] = useState("");
  const [productSuggestion, setProductSuggestion] =
    useState<ProductPreviewListModel | null>(null);
  const [description, setDescription] = useState("");
  const [searchAdd, setSearchAdd] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalSuggestion, setModalSuggestion] = useState<boolean>(false);
  const [modalCreateVariant, setModalCreateVariant] = useState<boolean>(false);
  const [modalConfirmDeleteOpen, setModalConfirmDeleteOpen] =
    useState<boolean>(false);
  const [modalCreateAttribude, setModalCreateAttribude] =
    useState<boolean>(false);
  const [subCategory, setSubCategory] = useState<SubCategoryListModel>();
  const [subCategoryItem, setSubCategoryItem] = useState<Subcategory | null>(
    null
  );
  const [productIdDelete, setProductIdDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [tabChangeAttempt, setTabChangeAttempt] = useState<string | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [deleteAttributeModal, setDeleteAttributeModal] =
    useState<boolean>(false);
  const [attributeToDelete, setAttributeToDelete] = useState<MainValue | null>(
    null
  );
  const [variantToResetDiscount, setVariantToResetDiscount] =
    useState<Variant | null>(null);
  const [resetDiscountModal, setResetDiscountModal] = useState<boolean>(false);

  // Add these state variables for variant deletion (add near other useState declarations)
  const [deleteVariantModal, setDeleteVariantModal] = useState<boolean>(false);
  const [variantToDelete, setVariantToDelete] = useState<Variant | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });
  const [dataAttribudeValueItem, setDataAttribudeValueItem] =
    useState<MainValue | null>(null);
  const [dataVariantItem, setDataVariantItem] = useState<Variant | null>(null);
  const [image, setImage] = useState<ProcessedImage | null>(null);

  useEffect(() => {
    getAllSubCategory();
  }, []);

  useEffect(() => {
    if (productId) {
      getProductFirstDetail();
      getProductSuggestion({});
    }
  }, [productId]);

  // Check for tab parameter in URL and set active tab accordingly
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      productId &&
      tabParam &&
      ["tab1", "tab2", "tab3", "tab4"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [productId, searchParams]);

  const getAllSubCategory = async () => {
    const response = await getSubCategoryService({});
    setSubCategory(response);
  };

  const getProductFirstDetail = async () => {
    setLoading(true);
    try {
      const responseProduct = await getProductByIdService({
        productId: productId!,
      });

      if (responseProduct.success) {
        setNameProduct(responseProduct?.data.name);
        setPriceProduct(responseProduct?.data.basePrice);
        setDescription(responseProduct?.data.description);
        setProductDetail(responseProduct.data);
        getSubCategory(responseProduct?.data.subcategoryId);
        if (responseProduct?.data.mainImage[0]?.imageUrl) {
          setImage({
            base64: responseProduct?.data.mainImage[0]?.imageUrl || "",
            type: null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      showToast("Failed to load product details", "error");
    }
    setLoading(false);
  };

  const getProductDetail = async () => {
    try {
      const responseProduct = await getProductByIdService({
        productId: productId!,
      });

      if (responseProduct.success) {
        setNameProduct(responseProduct?.data.name);
        setPriceProduct(responseProduct?.data.basePrice);
        setDescription(responseProduct?.data.description);
        setProductDetail(responseProduct.data);
        getSubCategory(responseProduct?.data.subcategoryId);
        if (responseProduct?.data.mainImage[0]?.imageUrl) {
          setImage({
            base64: responseProduct?.data.mainImage[0]?.imageUrl || "",
            type: null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      showToast("Failed to refresh product details", "error");
    }
  };

  const getProductSuggestion = async ({ page = 1 }: { page?: number }) => {
    try {
      const response = await getProductSuggestionService({
        productId: productId!,
        page,
      });
      setProductSuggestion(response.data);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
    }
  };

  const getSubCategory = async (id: string) => {
    try {
      const response = await getSubCategoryDetailService({ subCategoryId: id });
      setSubCategoryItem(response);
    } catch (error) {
      console.error("Error fetching subcategory:", error);
    }
  };

  const onItemSelect = (value: Subcategory) => {
    setSubCategoryItem(value);
  };

  const onClearSearch = () => {
    setSearchAdd("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAdd(e.target.value);
    onSearchCategory(e.target.value);
  };

  const onSearchCategory = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        onCallApi({ search: query });
      } else {
        onCallApi({ search: "" });
      }
    }, 700),
    []
  );

  const onCallApi = async ({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) => {
    const response = await getSubCategoryService({ page, search });
    setSubCategory(response);
  };

  const onLoadMore = async () => {
    if (
      subCategory?.pagination &&
      subCategory.pagination!.currentPage < subCategory.pagination!.totalPages
    ) {
      setLoading(true);
      const result = await getSubCategoryService({
        page: subCategory.pagination!.currentPage + 1,
      });
      setSubCategory((prev) => ({
        data: [...prev!.data, ...result.data],
        pagination: result.pagination,
      }));
    }
    setLoading(false);
  };

  // Enhanced refresh function
  const handleRefresh = async () => {
    if (productId) {
      await getProductDetail();
      await getProductSuggestion({});
      showToast("Data refreshed successfully!", "success");
    } else {
      await getAllSubCategory();
      showToast("Subcategories refreshed!", "success");
    }
  };

  // Improved validateForm function to ensure toast messages are displayed
  const validateForm = (): boolean => {
    let isValid = true;

    if (!nameProduct.trim()) {
      showToast("Product name is required", "error");
      isValid = false;
    }

    if (!priceProduct.trim()) {
      showToast("Product price is required", "error");
      isValid = false;
    } else if (isNaN(Number(priceProduct)) || Number(priceProduct) <= 0) {
      showToast("Please enter a valid price", "error");
      isValid = false;
    }

    if (!subCategoryItem) {
      showToast("Sub-category selection is required", "error");
      isValid = false;
    }

    if (!image) {
      showToast("Main product image is required", "error");
      isValid = false;
    }

    return isValid;
  };

  const createProduct = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await createProductService({
        name: nameProduct.trim() || "",
        description: description.trim() || "",
        subcategoryId: subCategoryItem?.id || "",
        basePrice: parseInt(priceProduct, 10),
      });

      if (response.success) {
        await uploadMainImageProductService({
          productId: response.data?.id || "",
          data: {
            fileContent: image?.base64.replace(base64Cut.cutHead, ""),
            fileExtension: image?.type || "",
          },
        });

        showToast(response.message, "success");
        router.push(
          `/${routed.productManagement}/${routed.product}/${routed.create}?id=${response.data.id}`
        );
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Failed to create product", "error");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await editProductService({
        productId: productDetail?.id || "",
        data: {
          name: nameProduct.trim(),
          description: description.trim(),
          subcategoryId: subCategoryItem?.id || "",
          basePrice: parseInt(priceProduct, 10),
        },
      });

      // Handle image upload/update
      if (productDetail?.mainImage[0]?.imageUrl) {
        if (image?.type) {
          await uploadMainImageProductService({
            productId: productDetail?.id || "",
            data: {
              fileContent: image?.base64.replace(base64Cut.cutHead, ""),
              fileExtension: image?.type || "",
              imageId: productDetail?.mainImage[0].id,
            },
          });
        }
      } else {
        if (image?.type) {
          await uploadMainImageProductService({
            productId: productDetail?.id || "",
            data: {
              fileContent: image?.base64.replace(base64Cut.cutHead, ""),
              fileExtension: image?.type || "",
            },
          });
        }
      }

      if (response.success) {
        showToast(response.message, "success");
        await getProductDetail(); // Refresh product data
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Failed to update product", "error");
    } finally {
      setLoading(false);
    }
  };

  const createAttribudeValue = async (item: any) => {
    setLoading(true);
    try {
      let response;
      if (item.selectedAttribute.name == "Color") {
        response = await createAttributeValueService({
          label: item.name.trim() || "",
          value: item.name.trim() || "",
          attributeId: item.selectedAttribute.id,
          valueType: "COLOR",
          isActive: true,
        });
      } else {
        response = await createAttributeValueService({
          label: item.name.trim() || "",
          value: item.name.trim() || "",
          attributeId: item.selectedAttribute.id,
          isActive: true,
        });
      }

      if (response.success) {
        const createdAttributeValue = response?.data[0];
        if (item.selectedAttribute.name == "Color" && item.image) {
          await addAttributeValueImageProductService({
            productId: productDetail!.id,
            data: {
              attributeId: createdAttributeValue.attributeId,
              attributeValueId: createdAttributeValue.id,
              fileContent: item.image.base64.replace(base64Cut.cutHead, ""),
              fileExtension: item.image.type,
            },
          });
        }

        const responseFinal = await addAttributeProductService({
          productId: productDetail!.id,
          data: {
            attributeId: createdAttributeValue.attributeId,
            attributeValues: [
              {
                attributeValueId: createdAttributeValue.id,
                name: item.name,
              },
            ],
          },
        });

        if (responseFinal.success) {
          showToast(responseFinal.message, "success");
        }
      }
      getProductDetail();
    } catch (error) {
      showToast("Failed to create attribute value", "error");
    } finally {
      setLoading(false);
    }
  };

  const onConfirmAttribudeValue = (item: any) => {
    setModalCreateAttribude(false);
    if (dataAttribudeValueItem) {
      updateAttribudeValue(item);
    } else {
      createAttribudeValue(item);
    }
    setDataAttribudeValueItem(null);
  };

  const updateAttribudeValue = async (item: any) => {
    setLoading(true);
    try {
      const response = await onUpdateSubAttribute({
        id: dataAttribudeValueItem?.attributeValue.id || "",
        data: {
          value: item.name.trim() || "",
          label: item.name.trim() || "",
        },
      });

      if (item?.image?.type) {
        await addAttributeValueImageProductService({
          productId: productDetail!.id,
          data: {
            attributeId:
              dataAttribudeValueItem?.attributeValue.attributeId || "",
            attributeValueId: dataAttribudeValueItem?.attributeValue.id || "",
            fileContent: item.image.base64.replace(base64Cut.cutHead, ""),
            fileExtension: item.image.type,
          },
        });
      }
      if (response.success) {
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
      getProductDetail();
    } catch (error) {
      showToast("Failed to update attribute value", "error");
    } finally {
      setLoading(false);
    }
  };

  const onOpenModalAttribude = () => {
    setDataAttribudeValueItem(null); // Clear previous data
    setModalCreateAttribude(true);
  };

  const onOpenModalVariants = () => {
    setDataVariantItem(null); // Clear previous data
    setModalCreateVariant(true);
  };

  const onOpenModalSuggestion = () => {
    setModalSuggestion(true);
  };

  const onUpdateVarant = async (data: FormData) => {
    const variantData: addVariant = {
      price: parseInt(data.price),
      discount: data.discount ? parseFloat(data.discount) : undefined,
      discountType: data.discountType ? data.discountType : undefined,
      discountStartDate: data.selectedFromDate
        ? convertToISOString(data.selectedFromDate)
        : undefined,
      discountEndDate: data.selectedToDate
        ? convertToISOString(data.selectedToDate)
        : undefined,
      stock: data.stock ? parseInt(data.stock) : undefined,
      isActive: true,
    };

    setLoading(true);
    try {
      const responseVariant = await updateVariantProductService({
        variantId: dataVariantItem?.id || "",
        data: variantData,
      });

      if (responseVariant.success) {
        showToast(responseVariant.message, "success");
      } else {
        showToast(responseVariant.message, "error");
      }

      // Upload new images
      const imageUploadPromises = data.imagesList
        .filter((image) => image.type) // Only upload new images
        .map((image) => {
          return addVariantImageProductService({
            variantId: dataVariantItem?.id || "",
            data: {
              fileContent: image.base64.replace(base64Cut.cutHead, ""),
              fileExtension: image.type!,
            },
          });
        });

      await Promise.all(imageUploadPromises);
      getProductDetail();
    } catch (error) {
      showToast("Failed to update variant", "error");
    } finally {
      setLoading(false);
    }
  };

  // Complete the onDeleteAttributeValue function
  const onDeleteAttributeValue = (value: Variant) => {
    setVariantToDelete(value);
    setDeleteVariantModal(true);
  };

  // Add the delete variant handler function
  const handleDeleteVariant = async () => {
    if (!variantToDelete) return;

    setDeleteVariantModal(false);
    setLoading(true);

    try {
      // Get yesterday's date to expire any active discount
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = convertToISOString(
        yesterday.toISOString().split("T")[0]
      );

      // Set isActive to false and expire discount by setting end date to yesterday
      const variantData: addVariant = {
        price: variantToDelete.price,
        discount: variantToDelete.discount
          ? parseFloat(variantToDelete.discount.toString())
          : undefined,
        discountType: variantToDelete.discountType
          ? variantToDelete.discountType
          : undefined,
        discountStartDate: variantToDelete.discountStartDate || undefined,
        discountEndDate: variantToDelete.discount ? yesterdayISO : undefined, // Set to yesterday if discount exists
        stock: variantToDelete.stock
          ? parseInt(variantToDelete.stock.toString())
          : undefined,
        isActive: false, // Set to false to "delete" the variant
      };

      const response = await updateVariantProductService({
        variantId: variantToDelete.id,
        data: variantData,
      });

      if (response.success) {
        showToast("Variant deleted successfully", "success");
        await getProductDetail(); // Refresh the product data
      } else {
        showToast(response.message || "Failed to delete variant", "error");
      }
    } catch (error) {
      showToast("Failed to delete variant", "error");
    } finally {
      setLoading(false);
      setVariantToDelete(null);
    }
  };

  const handleCloseDeleteVariantModal = () => {
    setDeleteVariantModal(false);
    setVariantToDelete(null);
  };

  const onSubmidModalVarants = async (data: FormData) => {
    if (dataVariantItem) {
      onUpdateVarant(data);
    } else {
      onCreateVarant(data);
    }
    setModalCreateVariant(false);
    setDataVariantItem(null);
  };

  const onCreateVarant = async (data: FormData) => {
    setLoading(true);
    try {
      const variantData: addVariant = {
        price: parseInt(data.price) || productDetail?.basePrice || 0,
        discount: data.discount ? parseFloat(data.discount) : undefined,
        discountType: data.discountType ? data.discountType : undefined,
        discountStartDate: data.selectedFromDate
          ? convertToISOString(data.selectedFromDate)
          : undefined,
        discountEndDate: data.selectedToDate
          ? convertToISOString(data.selectedToDate)
          : undefined,
        stock: data.stock ? parseInt(data.stock) : undefined,
        isActive: true,
      };

      const responseVariant = await addVariantProductService({
        productId: productDetail!.id,
        data: variantData,
      });

      if (responseVariant.success) {
        const variantId = responseVariant?.data?.id;

        // Add Color attribute
        const response = await addVariantValueProductService({
          productId: productDetail!.id,
          data: {
            variantId,
            attributeId:
              data.selectedAttributes.Color.attributeValue.attributeId,
            attributeValueId: data.selectedAttributes.Color.attributeValue.id,
          },
        });

        // Add Size attribute if present
        if (response.success && data.selectedAttributes?.Size?.id) {
          await addVariantValueProductService({
            productId: productDetail!.id,
            data: {
              variantId: response.data?.variant?.id,
              attributeId:
                data.selectedAttributes.Size.attributeValue.attributeId,
              attributeValueId: data.selectedAttributes.Size.attributeValue.id,
            },
          });
        }

        // Upload variant images
        const imageUploadPromises = data.imagesList
          .filter((image) => image.type) // Only upload new images
          .map((image) =>
            addVariantImageProductService({
              variantId,
              data: {
                fileContent: image.base64.replace(base64Cut.cutHead, ""),
                fileExtension: image.type!,
              },
            })
          );

        await Promise.all(imageUploadPromises);
        showToast(responseVariant.message, "success");
        getProductDetail();
      } else {
        showToast(responseVariant.message, "error");
      }
    } catch (error) {
      showToast("Failed to create variant", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add function to reset discount only
  const onResetDiscount = (value: Variant) => {
    setVariantToResetDiscount(value);
    setResetDiscountModal(true);
  };

  const handleCloseResetDiscountModal = () => {
    setResetDiscountModal(false);
    setVariantToResetDiscount(null);
  };

  // Add the reset discount handler function
  const handleResetDiscount = async () => {
    if (!variantToResetDiscount) return;

    setResetDiscountModal(false);
    setLoading(true);

    try {
      // Get yesterday's date to expire the discount
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = convertToISOString(
        yesterday.toISOString().split("T")[0]
      );

      // Reset discount by setting end date to yesterday, keep variant active
      const variantData: addVariant = {
        price: variantToResetDiscount.price,
        discount: variantToResetDiscount.discount
          ? parseFloat(variantToResetDiscount.discount.toString())
          : undefined,
        discountType: variantToResetDiscount.discountType
          ? variantToResetDiscount.discountType
          : undefined,
        discountStartDate:
          variantToResetDiscount.discountStartDate || undefined,
        discountEndDate: variantToResetDiscount.discount
          ? yesterdayISO
          : undefined, // Set to yesterday if discount exists
        stock: variantToResetDiscount.stock
          ? parseInt(variantToResetDiscount.stock.toString())
          : undefined,
        isActive: true, // Keep variant active, only reset discount
      };

      const response = await updateVariantProductService({
        variantId: variantToResetDiscount.id,
        data: variantData,
      });

      if (response.success) {
        showToast("Discount reset successfully", "success");
        await getProductDetail(); // Refresh the product data
      } else {
        showToast(response.message || "Failed to reset discount", "error");
      }
    } catch (error) {
      showToast("Failed to reset discount", "error");
    } finally {
      setLoading(false);
      setVariantToResetDiscount(null);
    }
  };

  const onConfirmSuggestion = async (val: Product | null) => {
    setModalSuggestion(false);
    if (val?.id == productDetail?.id) {
      showToast(
        "Cannot add the same product as a suggestion. Please choose a different product.",
        "error"
      );
      return;
    }
    setLoading(true);
    try {
      const response = await addProductSuggestionService({
        productId: productDetail!.id,
        data: { toId: val?.id || "" },
      });
      if (response.success) {
        getProductSuggestion({});
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Failed to add suggestion", "error");
    } finally {
      setLoading(false);
    }
  };

  const onApproveDelete = async () => {
    setModalConfirmDeleteOpen(false);
    setLoading(true);
    try {
      if (productIdDelete) {
        const response = await deleteProductSuggestionService({
          productId: productDetail?.id || "",
          data: { toId: productIdDelete },
        });
        if (response.success) {
          getProductSuggestion({});
          showToast(response.message, "success");
        } else {
          showToast(response.message, "error");
        }
      }
    } catch (error) {
      showToast("Failed to delete suggestion", "error");
    } finally {
      setLoading(false);
      setProductIdDelete(null); // Clear after operation
    }
  };

  const onEditVariants = (value: Variant) => {
    setModalCreateVariant(true);
    setDataVariantItem(value);
  };

  const toggleAttritudeStatus = async (
    value: MainValue,
    attributeName: string
  ) => {
    updateAttributeVisibility(attributeName, value.id, !value.isPublic);
    setLoadingUpdate({ id: value.id, loading: true });

    try {
      const response = await updateStatusAttribudeValueProductService({
        productAttributeToValueId: value.id,
        data: { isPublic: !value.isPublic },
      });

      if (response.success) {
        showToast(response.message, "success");
      } else {
        showToast(response?.message ?? "Error", "error");
        updateAttributeVisibility(attributeName, value.id, value.isPublic);
      }
    } catch (error) {
      showToast("Failed to update status", "error");
      updateAttributeVisibility(attributeName, value.id, value.isPublic);
    } finally {
      setLoadingUpdate({ id: value.id, loading: false });
    }
  };

  const updateAttributeVisibility = (
    attributeName: string,
    valueId: string,
    isPublic: boolean
  ) => {
    setProductDetail((prevProduct) => {
      if (!prevProduct) return null;

      const updatedAttributes = prevProduct.attributes.map((attribute) => {
        if (attribute.attribute.name == attributeName) {
          const updatedValues = attribute.values.map((value) => {
            if (value.id === valueId) {
              return { ...value, isPublic };
            }
            return value;
          });
          return { ...attribute, values: updatedValues };
        }
        return attribute;
      });

      return { ...prevProduct, attributes: updatedAttributes };
    });
  };

  const onUpdateAttribudeValue = (value: MainValue) => {
    setModalCreateAttribude(true);
    setDataAttribudeValueItem(value);
  };

  const handleDeleteAttribute = async () => {
    if (!attributeToDelete) return;

    setDeleteAttributeModal(false);

    try {
      // Find the attribute name for this value
      const attributeName = productDetail?.attributes.find((attr) =>
        attr.values.some((val) => val.id === attributeToDelete.id)
      )?.attribute.name;

      if (attributeName) {
        // Call the existing toggle function to deactivate the attribute
        await toggleAttritudeStatus(attributeToDelete, attributeName);
      } else {
        showToast("Could not find attribute to deactivate", "error");
      }
    } catch (error) {
      showToast("Failed to deactivate attribute", "error");
    } finally {
      setAttributeToDelete(null);
    }
  };

  function onViewProduct(value: ProductPreview): void {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.preview}/${value.productTo.id}`
    );
  }

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImageConvertBase64(file);
        const fileExtension = `.${file.type.split("/")[1]}`;
        setImage({
          base64: resizedBase64,
          type: fileExtension,
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        // Reset file input on error
        event.target.value = "";
      }
    }
  };

  // Handle tab change with validation
  const handleTabChange = (tabValue: string) => {
    // If we already have a productId, allow tab switching freely
    if (productId) {
      setActiveTab(tabValue);
      return;
    }

    // If trying to leave the first tab without completing form
    if (activeTab === "tab1" && tabValue !== "tab1") {
      // Save the requested tab to switch to after validation
      setTabChangeAttempt(tabValue);
      // Show the validation modal
      setShowValidationModal(true);
      return;
    }

    // Default case - allow tab change
    setActiveTab(tabValue);
  };

  // Handle validation confirmation
  const handleValidationConfirm = async () => {
    setShowValidationModal(false);

    // Save the target tab we want to navigate to after creation
    const targetTab = tabChangeAttempt;

    // Check if form is valid
    if (!validateForm()) {
      return;
    }

    // Create the product first
    setLoading(true);
    try {
      const response = await createProductService({
        name: nameProduct.trim() || "",
        description: description.trim() || "",
        subcategoryId: subCategoryItem?.id || "",
        basePrice: parseInt(priceProduct, 10),
      });

      if (response.success) {
        await uploadMainImageProductService({
          productId: response.data?.id || "",
          data: {
            fileContent: image?.base64.replace(base64Cut.cutHead, ""),
            fileExtension: image?.type || "",
          },
        });

        showToast("Product created successfully", "success");

        // Redirect to the same page with the new product ID and include tab parameter
        router.push(
          `/${routed.productManagement}/${routed.product}/${routed.create}?id=${response.data.id}&tab=${targetTab}`
        );
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast("Failed to create product", "error");
    } finally {
      setLoading(false);
      setTabChangeAttempt(null); // Reset the tab change attempt
    }
  };

  // Close modals properly
  const handleCloseAttributeModal = () => {
    setModalCreateAttribude(false);
    setDataAttribudeValueItem(null);
  };

  const handleCloseVariantModal = () => {
    setModalCreateVariant(false);
    setDataVariantItem(null);
  };

  const handleCloseSuggestionModal = () => {
    setModalSuggestion(false);
  };

  const handleCloseDeleteModal = () => {
    setModalConfirmDeleteOpen(false);
    setProductIdDelete(null);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    setTabChangeAttempt(null);
  };

  const handleCloseDeleteAttributeModal = () => {
    setDeleteAttributeModal(false);
    setAttributeToDelete(null);
  };

  const onDeleteAttribute = (value: MainValue) => {
    setAttributeToDelete(value);
    setDeleteAttributeModal(true);
  };

  // Custom header component
  const CustomHeader = () => (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">
          {productId ? "Edit Product" : "Create Product"}
        </h1>
        <div className="flex gap-2">
          {productId && (
            <ButtonCustom
              className="w-9 h-9"
              onClick={handleRefresh}
              title="Refresh Data"
            >
              <HiRefresh size={20} />
            </ButtonCustom>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <CustomHeader />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full bg-white mt-4 rounded-md shadow-sm"
      >
        <TabsList className="bg-[#F1F5F9] my-4 mx-4 py-6">
          <TabsTrigger className="py-2 px-8" value="tab1">
            Basic Details
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab2" disabled={!productId}>
            Attributes Value
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab3" disabled={!productId}>
            Variants
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab4" disabled={!productId}>
            Suggestion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tab1" className="px-4 pb-4">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end mb-4">
            {productId ? (
              <ButtonCustom
                onClick={editProduct}
                className="px-4 h-9"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Product"}
              </ButtonCustom>
            ) : (
              <ButtonCustom
                onClick={createProduct}
                className="px-4 h-9"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Product"}
              </ButtonCustom>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Upload Section */}
            <div className="flex-shrink-0">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Main Product Image<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="text-xs text-gray-500 mb-2">
                PNG/JPEG/JPG up to 5MB
              </div>
              {image ? (
                <div className="relative w-32 h-32">
                  {image.type ? (
                    <img
                      src={image.base64}
                      alt="Product Preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                  ) : (
                    <CashImage
                      width={128}
                      height={128}
                      imageUrl={`${config.BASE_URL}${image?.base64}`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    <IoClose />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="singleFileInput"
                  className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-md cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <input
                    id="singleFileInput"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <LuImagePlus className="text-gray-500 text-2xl mb-1" />
                  <span className="text-xs text-gray-500 text-center">
                    Upload Image
                  </span>
                </label>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Product Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    value={nameProduct}
                    onChange={(e) => setNameProduct(e.target.value)}
                    className="h-11"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Base Price<span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    value={priceProduct}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits and decimal point
                      const formattedValue = value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*)\./g, "$1");
                      setPriceProduct(formattedValue);
                    }}
                    className="h-11"
                    placeholder="Enter base price"
                  />
                </div>
              </div>

              <div className="mb-4">
                <DropDownSubCategory
                  onItemSelect={onItemSelect}
                  onClearSearch={onClearSearch}
                  value={searchAdd}
                  dataList={subCategory?.data || []}
                  onChange={onChange}
                  label="Sub-category"
                  onLoadMore={onLoadMore}
                  isLoading={loading}
                  selectedOption={subCategoryItem}
                  hasNext={
                    (subCategory?.pagination &&
                      subCategory.pagination!.currentPage <
                        subCategory.pagination!.totalPages) ||
                    false
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description..."
                  className="w-full p-3 rounded-md border border-gray-300 focus:border-primary focus:outline-none text-base resize-vertical"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2 - Attributes */}
        <TabsContent value="tab2" className="px-4 pb-4">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end mb-4">
            <ButtonCustom onClick={onOpenModalAttribude} className="px-4 h-9">
              Create Attribute
            </ButtonCustom>
          </div>
          <div>
            {productDetail?.attributes?.map((attribute) => (
              <div key={attribute.attribute.id} className="mb-6">
                <h2 className="font-semibold text-lg mb-2 mt-4">
                  {attribute.attribute.name}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        {attribudeHeader.map((header, index) => {
                          if (
                            attribute.attribute.name === "Size" &&
                            header === "IMAGE"
                          ) {
                            return null;
                          }
                          return (
                            <th
                              key={header + index.toString()}
                              className="border border-gray-300 px-4 py-2 text-left"
                            >
                              {header}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {attribute.values
                        .filter((value) => value.isPublic) // Only show public attributes
                        .map((value, index) => (
                          <tr key={value.id} className="hover:bg-gray-200">
                            <td className="border border-gray-300 px-4 py-2">
                              {index + 1}
                            </td>
                            <td
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  value?.attributeValue?.id || ""
                                );
                                showToast("Copied to clipboard", "success");
                              }}
                              className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-blue-50"
                              title="Click to copy ID"
                            >
                              {value?.attributeValue?.id || ""}
                            </td>

                            {attribute.attribute.name !== "Size" && (
                              <td className="border border-gray-300 px-4 py-2">
                                <CashImage
                                  width={32}
                                  height={32}
                                  imageUrl={`${config.BASE_URL}${value?.attributeValue?.image[0]?.imageUrl}`}
                                />
                              </td>
                            )}
                            <td className="border border-gray-300 px-4 py-2">
                              {value?.attributeValue?.label}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {formatTimestamp(
                                value?.attributeValue?.createdAt
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <span className="text-green-500">Active</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2 items-center">
                                <ButtonCustom
                                  onClick={() => onUpdateAttribudeValue(value)}
                                  className="w-6 h-6"
                                  title="Edit Attribute"
                                >
                                  <FiEdit size={14} className="text-white" />
                                </ButtonCustom>
                                <ButtonCustom
                                  onClick={() => onDeleteAttribute(value)}
                                  className="w-6 h-6 bg-red-600 hover:bg-red-700"
                                  disabled={
                                    loadingUpdate.loading &&
                                    loadingUpdate.id === value.id
                                  }
                                >
                                  <MdDeleteOutline
                                    size={14}
                                    className="text-white"
                                  />
                                </ButtonCustom>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3 - Variants */}
        <TabsContent value="tab3" className="px-4 pb-4">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end mb-4">
            <ButtonCustom onClick={onOpenModalVariants} className="px-4 h-9">
              Create Variants
            </ButtonCustom>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {variantsHeader.map((header, index) => (
                    <th
                      key={header + index.toString()}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productDetail?.variants
                  ?.filter((value) => value.isActive)
                  .map((value, index) => (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td
                        onClick={() => {
                          navigator.clipboard.writeText(value.id || "");
                          showToast("Copied to clipboard", "success");
                        }}
                        className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-blue-50"
                        title="Click to copy ID"
                      >
                        {value.id || ""}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value?.attributes?.map((attribute, index) =>
                          index === value.attributes.length - 1
                            ? attribute.attributeValue.label
                            : `${attribute.attributeValue.label}, `
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${value.price}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value.stock || "0"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value.discount ? `${value.discount}%` : "- - -"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {value.discountType || "- - -"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatTimestamp(value?.discountStartDate) || "- - -"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatTimestamp(value?.discountEndDate) || "- - -"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 max-w-[380px]">
                        <div className="flex gap-2 flex-wrap">
                          {value?.images.map((img, index) => (
                            <CashImage
                              key={index}
                              width={40}
                              height={40}
                              imageUrl={`${config.BASE_URL}${img?.imageUrl}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatTimestamp(value.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <ButtonCustom
                            className="w-6 h-6"
                            onClick={() => onEditVariants(value)}
                            title="Edit Variant"
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          {/* Reset Discount Button - only show if variant has a discount */}
                          {value.discount && (
                            <ButtonCustom
                              onClick={() => onResetDiscount(value)}
                              className="w-6 h-6 bg-orange-600 hover:bg-orange-700"
                              title="Reset Discount"
                              disabled={
                                loadingUpdate.loading &&
                                loadingUpdate.id === value.id
                              }
                            >
                              <HiRefresh size={14} className="text-white" />
                            </ButtonCustom>
                          )}
                          <ButtonCustom
                            onClick={() => onDeleteAttributeValue(value)}
                            className="w-6 h-6 bg-red-600 hover:bg-red-700"
                            disabled={
                              loadingUpdate.loading &&
                              loadingUpdate.id === value.id
                            }
                          >
                            <MdDeleteOutline size={14} className="text-white" />
                          </ButtonCustom>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 4 - Suggestions */}
        <TabsContent value="tab4" className="px-4 pb-4">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end mb-4">
            <ButtonCustom onClick={onOpenModalSuggestion} className="px-4 h-9">
              Create Suggestion
            </ButtonCustom>
          </div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {productPreviewSuggestionHeader.map((header, index) => (
                    <th
                      key={header + index.toString()}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={productPreviewSuggestionHeader.length}
                      className="text-center py-4"
                    >
                      <CenteredLoading loading={true} />
                    </td>
                  </tr>
                ) : productSuggestion?.data &&
                  productSuggestion.data.length > 0 ? (
                  productSuggestion.data.map((value, index: number) => {
                    const displayIndex =
                      ((productSuggestion.pagination?.currentPage || 1) - 1) *
                        15 +
                      index +
                      1;

                    return (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td className="border border-gray-300 px-4 py-2">
                          {displayIndex}
                        </td>
                        <td
                          onClick={() => {
                            navigator.clipboard.writeText(value.productTo.id);
                            showToast(
                              "Product ID copied to clipboard",
                              "success"
                            );
                          }}
                          className="border border-gray-300 px-4 py-2 max-w-72 truncate cursor-pointer hover:bg-blue-50"
                          title="Click to copy Product ID"
                        >
                          {value.productTo.id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.productTo.name || "- - -"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 max-w-xs">
                          <div
                            className="truncate"
                            title={value.productTo.description}
                          >
                            {value.productTo.description || "- - -"}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.productTo.viewCount}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {formatTimestamp(value.productTo.createdAt) ||
                            "- - -"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex gap-2">
                            <ButtonCustom
                              variant="cancel"
                              onClick={() => onViewProduct(value)}
                              className="w-6 h-6"
                              title="View Product"
                            >
                              <FaEye size={14} className="text-white" />
                            </ButtonCustom>
                            <ButtonCustom
                              onClick={() => {
                                setProductIdDelete(value?.toId);
                                setModalConfirmDeleteOpen(true);
                              }}
                              className="w-6 h-6 bg-red-600 hover:bg-red-700"
                              title="Delete Suggestion"
                            >
                              <MdDeleteOutline
                                size={16}
                                className="text-white"
                              />
                            </ButtonCustom>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={productPreviewSuggestionHeader.length}
                      className="text-center py-4"
                    >
                      No product suggestions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {productSuggestion && productSuggestion.data.length > 0 && (
            <div className="flex justify-end mr-8 my-4">
              <Pagination
                currentPage={productSuggestion.pagination?.currentPage || 1}
                onPageChange={(page) => getProductSuggestion({ page })}
                totalPages={productSuggestion.pagination?.totalPages || 1}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      <CenteredLoading loading={loading} />
      {/* Modals */}
      <AddAttributeModal
        isOpen={modalCreateAttribude}
        onConfirm={onConfirmAttribudeValue}
        onClose={handleCloseAttributeModal}
        title={
          dataAttribudeValueItem
            ? "Update Attribute Value"
            : "Create Attribute Value"
        }
        initialData={dataAttribudeValueItem}
      />
      <AddVarantsModal
        onSubmit={onSubmidModalVarants}
        attributes={productDetail?.attributes || []}
        onClose={handleCloseVariantModal}
        isOpen={modalCreateVariant}
        initialData={dataVariantItem}
      />
      <AddSuggestionModal
        isOpen={modalSuggestion}
        onClose={handleCloseSuggestionModal}
        onConfirm={onConfirmSuggestion}
        title="Create product suggestion"
      />
      <ConfirmationModal
        isOpen={modalConfirmDeleteOpen}
        title="Confirm Delete!"
        onClose={handleCloseDeleteModal}
        onConfirm={onApproveDelete}
        message="Are you sure you want to delete this product suggestion?"
        isNotCancel={true}
      />
      {/* Delete Attribute Modal */}
      <ConfirmationModal
        isOpen={deleteAttributeModal}
        title="Delete Attribute"
        onClose={handleCloseDeleteAttributeModal}
        onConfirm={handleDeleteAttribute}
        message={`Are you sure you want to delete the attribute "${attributeToDelete?.attributeValue?.label}"? This action cannot be undone.`}
        isNotCancel={true}
      />
      {/* Delete Variant Modal */}
      <ConfirmationModal
        isOpen={deleteVariantModal}
        title="Delete Variant"
        onClose={handleCloseDeleteVariantModal}
        onConfirm={handleDeleteVariant}
        message={`Are you sure you want to delete this variant? This action cannot be undone.`}
        isNotCancel={true}
      />

      {/* Reset Discount Modal */}
      <ConfirmationModal
        isOpen={resetDiscountModal}
        title="Reset Discount"
        onClose={handleCloseResetDiscountModal}
        onConfirm={handleResetDiscount}
        message={`Are you sure you want to reset the discount for this variant? The discount will be expired immediately.`}
        isNotCancel={true}
      />

      {/* Validation Modal */}
      <ConfirmationModal
        isOpen={showValidationModal}
        title="Create Product First"
        onClose={handleCloseValidationModal}
        onConfirm={handleValidationConfirm}
        message="You need to create and save the product before accessing other tabs. Do you want to create the product now?"
        isNotCancel={false}
      />
    </div>
  );
};

export default CreateProductComponent;
