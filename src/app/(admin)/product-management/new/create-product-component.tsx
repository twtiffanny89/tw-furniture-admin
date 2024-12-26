/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import DropDownSubCategory from "@/components/drop-down/drop-down-sub-dategory";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AddAttributeModal from "@/components/modal/add-attribude-modal";
import AddSuggestionModal from "@/components/modal/add-sugestion-modal";
import AddVarantsModal, {
  FormData,
} from "@/components/modal/add-variants-modal";
import Pagination from "@/components/pagination/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  attribudeHeader,
  productSuggestionHeader,
  variantsHeader,
} from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import {
  addAttributeProductService,
  addAttributeValueImageProductService,
  addProductSuggestionService,
  addVariant,
  addVariantImageProductService,
  addVariantProductService,
  addVariantValueProductService,
  createProductService,
  getProductByIdService,
  getProductSuggestionService,
} from "@/redux/action/product-management/product-service";
import { createAttributeValueService } from "@/redux/action/product-management/sub-attribude-service";
import {
  getSubCategoryDetailService,
  getSubCategoryService,
} from "@/redux/action/product-management/sub_category_service";
import { ProductDetailModel } from "@/redux/model/product/product-detail";
import { Product, ProductListModel } from "@/redux/model/product/product-model";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { config } from "@/utils/config/config";
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
  const [modalCreateAttribude, setModalCreateAttribude] =
    useState<boolean>(false);
  const [subCategory, setSubCategory] =
    useState<SubCategoryListModel>(initialSubCategory);
  const [subCategoryItem, setSubCategoryItem] = useState<Subcategory | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

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
  }

  async function getProductSuggestion({ page = 1 }: { page?: number }) {
    const resposne = await getProductSuggestionService({
      productId: productDetail?.id,
      page,
    });
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
      router.push(`/product-management/new?id=${response.data.id}`);
    } else {
      showToast(response.message, "error");
    }
  }

  async function onCreateAttribude(item: any) {
    setModalCreateAttribude(false);
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

    const createdAttributeValue = response.data[0];

    if (item.selectedAttribute.name == "Color") {
      console.log("### ===ahaha", item.image);
      const res = await addAttributeValueImageProductService({
        productId: productDetail!.id,
        data: {
          attributeId: createdAttributeValue.attributeId,
          attributeValueId: createdAttributeValue.id,
          fileContent: item.image.base64.replace(base64Cut.cutHead, ""),
          fileExtension: item.image.type,
        },
      });
      console.log("### ===ahahares", res);
    }

    await addAttributeProductService({
      productId: productDetail!.id,
      data: {
        attributeId: createdAttributeValue.attributeId,
        attributeValues: [
          {
            id: createdAttributeValue.id,
            attributeId: createdAttributeValue.attributeId,
          },
        ],
      },
    });
    if (response.success) {
      getProductDetail();
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
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

  async function onSubmidVarants(data: FormData) {
    const variantData: addVariant = {
      price: parseInt(data.price),
      discount: data.discount ? parseFloat(data.discount) : undefined,
      discountType: data.discountType ? data.discountType : undefined,
      discountStartDate: data.selectedFromDate
        ? data.selectedFromDate
        : undefined,
      discountEndDate: data.selectedToDate ? data.selectedToDate : undefined,
      stock: data.stock ? parseInt(data.stock) : undefined,
      sku: data.sku,
    };

    const responseVariant = await addVariantProductService({
      productId: productDetail!.id,
      data: variantData,
    });

    const variantId = responseVariant.data.id;

    const response = await addVariantValueProductService({
      productId: productDetail!.id,
      data: {
        variantId,
        attributeId: data.selectedAttributes.Color.attributeId,
        attributeValueId: data.selectedAttributes.Color.id,
      },
    });

    if (data.selectedAttributes?.Size?.id) {
      await addVariantValueProductService({
        productId: productDetail!.id,
        data: {
          variantId: response.data.variant.id,
          attributeId: data.selectedAttributes.Size.attributeId,
          attributeValueId: data.selectedAttributes.Size.id,
        },
      });
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
  }

  async function onConfirmSuggestion(val: Product) {
    console.log("## ==aa", productDetail!.id, val.id);
    const response = await addProductSuggestionService({
      productId: productDetail!.id,
      data: { toId: val.id },
    });
    if (response.success) {
      showToast(response.message, "success");
    } else {
      console.log("###ajja", response.test);
      showToast(response.message, "error");
    }
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
            Attributes
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

          <div className="mt-8 flex justify-end">
            <ButtonCustom onClick={createProduct} className="px-4 h-9">
              Create Color
            </ButtonCustom>
          </div>
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
                <h2 className="font-semibold text-lg mb-2 ">
                  {attribute.attribute.name}
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead className="bg-gray-100">
                    <tr>
                      {attribudeHeader.map((header, index) => (
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
                    {attribute.values.map((value, index) => (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td>{index}</td>
                        <td>
                          <CashImage
                            width={32}
                            height={32}
                            imageUrl={`${config.BASE_URL}${value?.image[0]?.imageUrl}`}
                          />
                        </td>
                        <td>{value.label}</td>

                        <td>{formatTimestamp(value.createdAt)}</td>
                        <td>
                          <div className="flex gap-2">
                            <ButtonCustom className="w-6 h-6 ">
                              <FiEdit size={14} className="text-white" />
                            </ButtonCustom>
                            <button className="w-6 h-6 bg-red-600 rounded flex justify-center items-center">
                              <MdDeleteOutline
                                size={16}
                                className="text-white"
                              />
                            </button>
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
                    <td>{formatTimestamp(value?.discountStartDate)}</td>
                    <td>{formatTimestamp(value?.discountEndDate)}</td>
                    <td>{value?.sku}</td>
                    <td>
                      <div className="flex gap-2">
                        {value?.images.map((img, index) => (
                          <CashImage
                            key={index}
                            imageUrl={`${config.BASE_URL}${img.imageUrl}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td>{formatTimestamp(value.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <ButtonCustom className="w-6 h-6 ">
                          <FiEdit size={14} className="text-white" />
                        </ButtonCustom>
                        <button className="w-6 h-6 bg-red-600 rounded flex justify-center items-center">
                          <MdDeleteOutline size={16} className="text-white" />
                        </button>
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
                            <ButtonCustom className="w-6 h-6 ">
                              <FiEdit size={14} className="text-white" />
                            </ButtonCustom>
                            <button className="w-6 h-6 bg-red-600 rounded flex justify-center items-center">
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

      <AddAttributeModal
        isOpen={modalCreateAttribude}
        onConfirm={onCreateAttribude}
        onClose={() => setModalCreateAttribude(false)}
        title="Create Attribute"
      />
      <CenteredLoading loading={loading} />
      <AddVarantsModal
        onSubmit={onSubmidVarants}
        attributes={productDetail?.attributes || []}
        onClose={() => setModalCreateVariant(false)}
        isOpen={modalCreateVariant}
      />
      <AddSuggestionModal
        isOpen={modalSuggestion}
        onClose={() => setModalSuggestion(false)}
        onConfirm={onConfirmSuggestion}
        title="Create product suggestion"
      />
    </div>
  );
};

export default CreateProductComponent;
