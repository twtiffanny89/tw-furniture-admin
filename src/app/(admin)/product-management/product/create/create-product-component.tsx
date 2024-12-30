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
  productSuggestionHeader,
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
  removeAttribudeValueProductService,
  removeAttributeProductService,
  removeVariantProductService,
  updateStatusAttribudeValueProductService,
  updateVariantProductService,
  updateVariantValueProductService,
} from "@/redux/action/product-management/product-service";
import {
  createAttributeValueService,
  onUpdateSubAttribute,
} from "@/redux/action/product-management/sub-attribude-service";
import {
  getSubCategoryDetailService,
  getSubCategoryService,
} from "@/redux/action/product-management/sub_category_service";
import {
  MainValue,
  ProductDetailModel,
  Value,
  Variant,
} from "@/redux/model/product/product-detail";
import { Product } from "@/redux/model/product/product-model";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { config } from "@/utils/config/config";
import { convertToISOString } from "@/utils/date/convert_data";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

interface ProductDetailComponentProps {
  initialSubCategory: SubCategoryListModel;
}

const CreateProductComponent: React.FC<ProductDetailComponentProps> = ({
  initialSubCategory,
}) => {
  const [productDetail, setProductDetail] = useState<ProductDetailModel | null>(
    null
  );
  const [nameProduct, setNameProduct] = useState("");
  const [priceProduct, setPriceProduct] = useState("");
  const [productSuggestion, setProductSuggestion] = useState<any | null>(null);
  const [description, setDescription] = useState("");
  const [searchAdd, setSearchAdd] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalSuggestion, setModalSuggestion] = useState<boolean>(false);
  const [modalCreateVariant, setModalCreateVariant] = useState<boolean>(false);
  const [modalConfirmDeleteOpen, setModalConfirmDeleteOpen] =
    useState<boolean>(false);
  const [modalCreateAttribude, setModalCreateAttribude] =
    useState<boolean>(false);
  const [subCategory, setSubCategory] =
    useState<SubCategoryListModel>(initialSubCategory);
  const [subCategoryItem, setSubCategoryItem] = useState<Subcategory | null>(
    null
  );
  const [productIdDelete, setProductIdDelete] = useState<string | null>(null);
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

  const [selectTab, setSelectTab] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      getProductDetail();
      getProductSuggestion({});
    }
  }, [productId]);

  async function getProductDetail() {
    const responseProduct = await getProductByIdService({
      productId: productId!,
    });

    if (responseProduct.success) {
      setNameProduct(responseProduct?.data.name);
      setPriceProduct(responseProduct?.data.basePrice);
      setDescription(responseProduct?.data.description);
      setProductDetail(responseProduct.data);
      getSubCategory(responseProduct?.data.subcategoryId);
    }
    return responseProduct;
  }

  async function getProductSuggestion({ page = 1 }: { page?: number }) {
    const resposne = await getProductSuggestionService({
      productId: productId!,
      page,
    });

    console.log("### ==resposne", resposne);
    setProductSuggestion(resposne.data);
  }

  async function getSubCategory(id: string) {
    const resposne = await getSubCategoryDetailService({ subCategoryId: id });
    setSubCategoryItem(resposne);
  }

  function onItemSelect(value: Subcategory) {
    setSubCategoryItem(value);
  }

  function onClearSearch() {
    setSearchAdd("");
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchAdd(e.target.value);
    onSearchCategory(e.target.value);
  }

  const onSearchCategory = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        onCallApi({ search: query });
      } else {
        onCallApi({ search: "" });
      }
    }),
    []
  );

  async function onCallApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    const response = await getSubCategoryService({ page, search });
    setSubCategory(response);
  }

  const onLoadMore = async () => {
    if (
      subCategory.pagination &&
      subCategory.pagination!.currentPage < subCategory.pagination!.totalPages
    ) {
      setLoading(true);
      const result = await getSubCategoryService({
        page: subCategory.pagination!.currentPage + 1,
      });
      setSubCategory((prev) => ({
        data: [...prev.data, ...result.data],
        pagination: result.pagination,
      }));
    }
    setLoading(false);
  };

  async function createProduct() {
    const response = await createProductService({
      name: nameProduct,
      description: description,
      subcategoryId: subCategoryItem?.id || "",
      basePrice: parseInt(priceProduct, 10),
    });

    if (response.success) {
      showToast(response.message, "success");
      router.push(
        `/${routed.productManagement}/${routed.product}/${routed.create}?id=${response.data.id}`
      );
    } else {
      showToast(response.message, "error");
    }
  }

  async function editProduct() {
    const response = await editProductService({
      productId: productDetail?.id || "",
      data: {
        name: nameProduct,
        description: description,
        subcategoryId: subCategoryItem?.id || "",
        basePrice: parseInt(priceProduct, 10),
      },
    });

    if (response.success) {
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
  }

  function isDuplicateName(attributes: any[], newName: string): boolean {
    const allNames = attributes?.flatMap((attr) =>
      attr.values.map((value: any) => value.name.toLowerCase())
    );
    return allNames.includes(newName.toLowerCase());
  }

  async function createAttribudeValue(item: any) {
    if (isDuplicateName(productDetail!.attributes, item.name)) {
      showToast(
        "This Attribute is already in product. Please choose a different name.!",
        "error"
      );
      return;
    }
    setLoading(true);
    let response;
    if (item.selectedAttribute.name == "Color") {
      response = await createAttributeValueService({
        label: item.name,
        value: item.name,
        attributeId: item.selectedAttribute.id,
        valueType: "COLOR",
      });
    } else {
      response = await createAttributeValueService({
        label: item.name,
        value: item.name,
        attributeId: item.selectedAttribute.id,
      });
    }

    if (response.success) {
      const createdAttributeValue = response?.data[0];
      if (item.selectedAttribute.name == "Color") {
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
      } else {
        showToast(responseFinal.message, "error");
      }
    }
    getProductDetail();
    setLoading(false);
  }

  function onConfirmAttribudeValue(item: any) {
    setModalCreateAttribude(false);
    if (dataAttribudeValueItem) {
      updateAttribudeValue(item);
    } else {
      createAttribudeValue(item);
    }

    setDataAttribudeValueItem(null);
  }

  async function updateAttribudeValue(item: any) {
    setLoading(true);
    const response = await onUpdateSubAttribute({
      id: dataAttribudeValueItem?.attributeValue.id || "",
      data: {
        value: item.name,
        label: item.name,
      },
    });

    if (item?.image?.type) {
      await addAttributeValueImageProductService({
        productId: productDetail!.id,
        data: {
          attributeId: dataAttribudeValueItem?.attributeValue.attributeId || "",
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
    setLoading(false);
  }

  function onOpenModalAttribude() {
    setModalCreateAttribude(true);
  }

  function onOpenModalVariants() {
    setModalCreateVariant(true);
  }

  function onOpenModalSuggestion() {
    setModalSuggestion(true);
  }

  async function onUpdateVarant(data: FormData) {
    console.log("## ==data", data);

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
      sku: data.sku || undefined,
    };

    setLoading(true);

    const responseVariant = await updateVariantProductService({
      variantId: dataVariantItem?.id || "",
      data: variantData,
    });

    if (responseVariant.success) {
      getProductDetail();
      showToast(responseVariant.message, "success");
    } else {
      showToast(responseVariant.message, "error");
    }

    const imageUploadPromises = data.imagesList.map((image) => {
      if (image.type) {
        return addVariantImageProductService({
          variantId: dataVariantItem?.id || "",
          data: {
            fileContent: image.base64.replace(base64Cut.cutHead, ""),
            fileExtension: image.type!,
          },
        });
      }
    });
    await Promise.all(imageUploadPromises);
    getProductDetail();
    setLoading(false);
  }

  async function onSubmidModalVarants(data: FormData) {
    if (dataVariantItem) {
      onUpdateVarant(data);
    } else {
      onCreateVarant(data);
    }
    setModalCreateVariant(false);
    setDataVariantItem(null);
  }

  async function onCreateVarant(data: FormData) {
    const targetLabel =
      (data.selectedAttributes?.Color?.attributeValue?.label || "") +
      (data.selectedAttributes?.Size?.attributeValue?.label || "");
    const combinedLabelsList = productDetail?.variants.map(
      (variant) =>
        variant.attributes.map((attr) => attr.attributeValue.label).join("") // Combine labels without spaces
    );
    const exists = combinedLabelsList?.includes(targetLabel);

    if (exists) {
      showToast(
        "This Attribute variant is already in product. Please choose a different name.!",
        "error"
      );
      return;
    }

    setLoading(true);

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
      sku: data.sku || undefined,
    };

    const responseVariant = await addVariantProductService({
      productId: productDetail!.id,
      data: variantData,
    });

    if (responseVariant.success) {
      const variantId = responseVariant?.data?.id;
      const response = await addVariantValueProductService({
        productId: productDetail!.id,
        data: {
          variantId,
          attributeId: data.selectedAttributes.Color.attributeValue.attributeId,
          attributeValueId: data.selectedAttributes.Color.attributeValue.id,
        },
      });

      if (response.success) {
        if (data.selectedAttributes?.Size?.id) {
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
      }

      const imageUploadPromises = data.imagesList.map((image) =>
        addVariantImageProductService({
          variantId,
          data: {
            fileContent: image.base64.replace(base64Cut.cutHead, ""),
            fileExtension: image.type!,
          },
        })
      );
      await Promise.all(imageUploadPromises);
      getProductDetail();
    }
    setLoading(false);
  }

  async function onConfirmSuggestion(val: Product | null) {
    setModalSuggestion(false);
    if (val?.id == productDetail?.id) {
      showToast(
        "This Product suggestion is already in product. Please choose a different product.!",
        "error"
      );
      return;
    }
    setLoading(true);
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
    setLoading(false);
  }

  async function handleDeleteSuggestion() {
    setModalConfirmDeleteOpen(false);
    setLoading(true);
    const response = await deleteProductSuggestionService({
      productId: productDetail?.id || "",
      data: { toId: productIdDelete || "" },
    });
    if (response.success) {
      getProductSuggestion({});
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
    setProductIdDelete(null);
    setLoading(false);
  }

  async function onApproveDelete() {
    setModalConfirmDeleteOpen(false);
    setLoading(true);
    if (productIdDelete) {
      const response = await deleteProductSuggestionService({
        productId: productDetail?.id || "",
        data: {
          toId: productIdDelete,
        },
      });
      if (response.success) {
        getProductSuggestion({});
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    }
    setLoading(false);
  }

  function onEditVariants(value: Variant) {
    setModalCreateVariant(true);
    setDataVariantItem(value);
  }

  async function toggleCategoryStatus(value: MainValue) {
    setLoadingUpdate({
      id: value.id,
      loading: true,
    });

    const response = await updateStatusAttribudeValueProductService({
      productAttributeToValueId: value.id,
      data: {
        isPublic: !value.isPublic,
      },
    });

    if (response.success) {
      getProductDetail();
      showToast(response.message, "success");
    } else {
      showToast(response?.message ?? "Error", "error");
    }
    setLoadingUpdate({
      id: value.id,
      loading: false,
    });
  }

  function onUpdateAttribudeValue(value: MainValue) {
    setModalCreateAttribude(true);
    setDataAttribudeValueItem(value);
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Create Product</h1>
      </div>
      <Tabs defaultValue="tab1" className="w-full bg-white mt-4">
        <TabsList className="bg-[#F1F5F9] my-4 mx-4 py-6">
          <TabsTrigger className="py-2 px-8" value="tab1">
            Basic Details
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab2">
            Attributes Value
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab3">
            Variants
          </TabsTrigger>
          <TabsTrigger className="py-2 px-8" value="tab4">
            Suggestion
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="min-h-screen">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className=" flex justify-end">
            {productId ? (
              <ButtonCustom onClick={editProduct} className="px-4 h-9">
                Edit Product
              </ButtonCustom>
            ) : (
              <ButtonCustom onClick={createProduct} className="px-4 h-9">
                Create Product
              </ButtonCustom>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name Product
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={nameProduct}
                onChange={(e) => setNameProduct(e.target.value)}
                className="h-11"
              />
            </div>

            <DropDownSubCategory
              onItemSelect={onItemSelect}
              onClearSearch={onClearSearch}
              value={searchAdd}
              dataList={subCategory.data}
              onChange={onChange}
              label="Sub-category"
              onLoadMore={onLoadMore}
              isLoading={loading}
              selectedOption={subCategoryItem}
            />

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Base price (Optional)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={priceProduct}
                onChange={(e) => setPriceProduct(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type your decri here..."
            className="w-full p-2 border rounded mt-8"
            style={{
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </TabsContent>

        {/*  */}
        <TabsContent className="min-h-screen" value="tab2">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end">
            <ButtonCustom onClick={onOpenModalAttribude} className="px-4 h-9">
              Create Attibute
            </ButtonCustom>
          </div>
          <div>
            {productDetail?.attributes?.map((attribute) => (
              <div key={attribute.attribute.id}>
                <h2 className="font-semibold text-lg mb-2 mt-4 ">
                  {attribute.attribute.name}
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead className="bg-gray-100">
                    <tr>
                      {attribudeHeader.map((header, index) => {
                        if (
                          attribute.attribute.name === "Size" &&
                          header === "Image"
                        ) {
                          return null; // Skip rendering this header
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
                    {attribute.values.map((value, index) => (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td>{index}</td>
                        {attribute.attribute.name !== "Size" && (
                          <td>
                            <CashImage
                              width={32}
                              height={32}
                              imageUrl={`${config.BASE_URL}${value?.attributeValue?.image[0]?.imageUrl}`}
                            />
                          </td>
                        )}
                        <td>{value?.attributeValue?.label}</td>

                        <td>
                          {formatTimestamp(value?.attributeValue?.createdAt)}
                        </td>
                        <td>
                          <div className="flex gap-2 items-center">
                            <Switch
                              disable={loadingUpdate.loading}
                              checked={value.isPublic}
                              onChange={() => toggleCategoryStatus(value)}
                            />
                            <span
                              className={
                                value.isPublic
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {value.isPublic ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <ButtonCustom
                              onClick={() => onUpdateAttribudeValue(value)}
                              className="w-6 h-6 "
                            >
                              <FiEdit size={14} className="text-white" />
                            </ButtonCustom>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tab3">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div className="flex justify-end">
            <ButtonCustom onClick={onOpenModalVariants} className="px-4 h-9">
              Create Variants
            </ButtonCustom>
          </div>
          <div className="mt-4 overflow-x-auto min-h-[50vh]">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                {productDetail?.variants?.map((value, index) => (
                  <tr key={value.id} className="hover:bg-gray-200">
                    <td>{index}</td>
                    <td>
                      {value?.attributes?.map((attribute, index) =>
                        index === value.attributes.length - 1
                          ? attribute.attributeValue.label
                          : `${attribute.attributeValue.label}, `
                      )}
                    </td>
                    <td>{value.price}</td>
                    <td>{value.stock}</td>
                    <td>
                      {formatTimestamp(value?.discountStartDate) || "- - -"}
                    </td>
                    <td>
                      {formatTimestamp(value?.discountEndDate) || "- - -"}
                    </td>
                    <td>{value?.sku}</td>
                    <td>
                      <div className="flex gap-2">
                        {value?.images.map((img, index) => (
                          <CashImage
                            key={index}
                            imageUrl={`${config.BASE_URL}${img?.imageUrl}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td>{formatTimestamp(value.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <ButtonCustom
                          className="w-6 h-6"
                          onClick={() => onEditVariants(value)}
                        >
                          <FiEdit size={14} className="text-white" />
                        </ButtonCustom>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="tab4">
          <div className="h-4 bg-[#F7F8FA] mb-4" />
          <div>
            <div className="flex justify-end mb-4">
              <ButtonCustom
                onClick={onOpenModalSuggestion}
                className="px-4 h-9"
              >
                Create Suggestion
              </ButtonCustom>
            </div>
            <div className="overflow-x-auto min-h-[50vh]">
              <table>
                <thead className="bg-gray-100">
                  <tr>
                    {productSuggestionHeader.map((header, index) => (
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
                  {productSuggestion?.data.map((value: any, index: number) => {
                    const displayIndex =
                      ((productSuggestion.pagination?.currentPage || 1) - 1) *
                        15 +
                      index +
                      1;
                    return (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td>{displayIndex}</td>
                        <td>{value.productTo.id}</td>
                        <td>{value.productTo.name}</td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setProductIdDelete(value?.toId);
                                setModalConfirmDeleteOpen(true);
                              }}
                              className="w-6 h-6 bg-red-600 rounded flex justify-center items-center"
                            >
                              <MdDeleteOutline
                                size={16}
                                className="text-white"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {productSuggestion && productSuggestion.data.length > 0 && (
              <div className="flex justify-end mr-8 mt-8">
                <Pagination
                  currentPage={productSuggestion.pagination?.currentPage || 1}
                  onPageChange={(page) => getProductSuggestion({ page })}
                  totalPages={productSuggestion.pagination?.totalPages || 1}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CenteredLoading loading={loading} />

      <AddAttributeModal
        isOpen={modalCreateAttribude}
        onConfirm={onConfirmAttribudeValue}
        onClose={() => setModalCreateAttribude(false)}
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
        onClose={() => setModalCreateVariant(false)}
        isOpen={modalCreateVariant}
        initialData={dataVariantItem}
      />

      <AddSuggestionModal
        isOpen={modalSuggestion}
        onClose={() => setModalSuggestion(false)}
        onConfirm={onConfirmSuggestion}
        title="Create product suggestion"
      />

      <ConfirmationModal
        isOpen={modalConfirmDeleteOpen}
        title="Confirm Delete!"
        onClose={() => setModalConfirmDeleteOpen(false)}
        onConfirm={onApproveDelete}
        message={`Are you sure you want to delete?`}
        isNotCancel={true}
      />
    </div>
  );
};

export default CreateProductComponent;
