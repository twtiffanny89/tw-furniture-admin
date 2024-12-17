"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import DropDownMenu from "@/components/custom/drop_down_menu";
import Input from "@/components/custom/Input";
import DropDownSubCategory from "@/components/drop-down/drop-down-sub-dategory";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AddProductColorModal from "@/components/modal/add-product-color-modal";
import { colorHeader, eventHeader } from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import { getAttributeService } from "@/redux/action/product-management/attribute-service";
import {
  addAttributeProductService,
  addAttributeValueImageProductService,
  addVariantImageProductService,
  addVariantProductService,
  addVariantValueProductService,
  createProductService,
  getProductByIdService,
} from "@/redux/action/product-management/product-service";
import { createSubAttributeService } from "@/redux/action/product-management/sub-attribude-service";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";
import { CategorySelect } from "@/redux/model/category/category_model";
import { ProductDetailModel } from "@/redux/model/product/product-detail";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { config } from "@/utils/config/config";
import { debounce } from "@/utils/debounce/debounce";
import React, { useCallback, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

interface ProductDetailComponentProps {
  initialSubCategory: SubCategoryListModel;
}

const ProductDetailComponet: React.FC<ProductDetailComponentProps> = ({
  initialSubCategory,
}) => {
  const [nameProduct, setNameProduct] = useState("");
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] =
    useState<SubCategoryListModel>(initialSubCategory);
  const [searchAdd, setSearchAdd] = useState("");
  const [subCategoryItem, setSubCategoryItem] = useState<Subcategory | null>(
    null
  );
  const [modalType, setModalType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalCreateColor, setModalCreateColor] = useState<boolean>(false);
  const targetVariantId = "cm4bh5e3d0000wani52gr2emw";
  //   Step2

  const [productItem, setProductItem] = useState<ProductDetailModel | null>(
    null
  );

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

  function onItemSelect(value: Subcategory) {
    setSubCategoryItem(value);
  }

  function onClearSearch() {
    setSearchAdd("");
  }

  const onLoadMore = async () => {
    if (
      subCategory.pagination &&
      subCategory.pagination!.currentPage < subCategory.pagination!.totalPages
    ) {
      setLoading(true);
      // Simulate fetching data
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

  async function onCreateProduct() {
    const responseProduct = await getProductByIdService({
      productId: "cm4sm7mtg0057pj0rksm432es",
    });
    console.log("### ===hahaah", responseProduct.data);
    if (responseProduct.success) {
      showToast("Ok", "success");
      setProductItem(responseProduct.data);
    } else {
      showToast("No", "error");
    }

    return;

    const response = await createProductService({
      name: nameProduct,
      description: description,
      subcategoryId: subCategoryItem?.id || "",
    });
    if (response.success) {
      showToast(response.message, "success");
      const responseProduct = await getProductByIdService({
        productId: response.data.id,
      });
      setProductItem(responseProduct.data);
    } else {
      showToast(response.message, "error");
    }
  }

  async function onConfirmCreateColor(value: any) {
    try {
      console.log("#### === Starting Create Color", value);
      setModalCreateColor(false);
      setLoading(true);

      // Fetch attributes and find "Color"
      const responseAttribute = await getAttributeService({});
      const filter = responseAttribute.data.find(
        (item: any) => item.name === modalType
      );

      if (!filter) {
        throw new Error("Color attribute not found");
      }

      console.log("#### === Attribute Filtered", filter);

      // Create Sub-Attribute
      const createResponse = await createSubAttributeService({
        label: value.attribudeValueName,
        value: value.attribudeValueName,
        attributeId: filter.id,
        valueType: "SIZE",
      });

      if (!createResponse.success) {
        throw new Error("Failed to create sub-attribute");
      }

      // "2m"

      const createdAttribute = createResponse.data[0];

      console.log("#### === Sub-Attribute Created", createdAttribute);

      // Add Price
      await addAttributeProductService({
        productId: productItem!.id,
        data: {
          attributeId: createdAttribute.attributeId,
          attributeValues: [
            {
              id: createdAttribute.id,
              attributeId: createdAttribute.attributeId,
            },
          ],
        },
      });

      console.log("#### === Price Added");

      // Upload Attribute Image
      // For button
      // await addAttributeValueImageProductService({
      //   productId: productItem!.id,
      //   data: {
      //     attributeId: createdAttribute.attributeId,
      //     attributeValueId: createdAttribute.id,
      //     fileContent: value.image.base64.replace(base64Cut.cutHead, ""),
      //     fileExtension: value.image.type,
      //   },
      // });

      console.log("#### === Image Uploaded");

      // Add Variant
      const responseVariant = await addVariantProductService({
        productId: productItem!.id,
        data: { price: value.price },
      });

      if (!responseVariant.success) {
        throw new Error("Failed to create variant");
      }

      const variantId = responseVariant.data.id;

      console.log("#### === Variant Created", responseVariant);

      await addVariantValueProductService({
        productId: createdAttribute.id,
        data: {
          attributeId: createdAttribute.attributeId,
          attributeValueId: createdAttribute.id,
          variantId,
        },
      });

      // Add Variant Value
      await addVariantValueProductService({
        productId: createdAttribute.id,
        data: {
          attributeId: createdAttribute.attributeId,
          attributeValueId: createdAttribute.id,
          variantId: "cm4smatfn005jpj0rgu8plq1o",
        },
      });

      console.log("#### === Variant Value Added");

      // Upload Variant Images
      const imageUploadPromises = value.imagesList.map((image: any) =>
        addVariantImageProductService({
          variantId,
          data: {
            fileContent: image.base64.replace(base64Cut.cutHead, ""),
            fileExtension: image.type,
          },
        })
      );

      const uploadResults = await Promise.all(imageUploadPromises);

      onCreateProduct();
      console.log("#### === Variant Images Uploaded", uploadResults);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function openModalCreateColor() {
    setModalType("Color");
    setModalCreateColor(true);
  }

  function openModalCreateSize() {
    setModalType("Size");
    setModalCreateColor(true);
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product Detail</h1>
        <ButtonCustom onClick={onCreateProduct} className="px-4 h-9">
          Create Product
        </ButtonCustom>
      </div>
      {/* Step 1 */}
      <div className="mt-4 bg-white min-h-full">
        <div className="grid grid-cols-3 gap-4">
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
        </div>

        <textarea
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Type your decri here..."
          className="w-full p-2 border rounded mt-4"
          style={{
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* Create color */}
        <div>
          <div className="bg-white flex justify-between mt-4">
            <h1 className="font-bold text-xl">Create Color</h1>
            <ButtonCustom onClick={openModalCreateColor} className="px-4 h-9">
              Create Color
            </ButtonCustom>
          </div>

          <div className="overflow-x-auto ">
            <table className="mt-4">
              <thead className="bg-gray-100">
                <tr>
                  {colorHeader.map((header, index) => (
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
                {productItem?.attributes[0]?.values.map((value, index) => {
                  const variant = productItem.variants.find((val) => {
                    return val.attributes.some(
                      (attribute) =>
                        attribute.attributeId === value.attributeId &&
                        attribute.attributeValue.value === value.value
                    );
                  });

                  return (
                    <tr key={index} className="hover:bg-gray-200">
                      <td>{index}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${value.image[0]?.imageUrl}`}
                        />
                      </td>
                      <td>{value.label}</td>
                      <td>{value.valueType}</td>
                      <td>{variant?.price}</td>
                      <td className="max-w-full">
                        {
                          <div className="flex gap-2">
                            {variant?.images?.map((image, index) => (
                              <CashImage
                                key={image.id}
                                imageUrl={`${config.BASE_URL}${image.imageUrl}`}
                                width={32}
                                height={32}
                              />
                            ))}
                          </div>
                        }
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            //   onClick={() => onEditBanner(value)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          <button
                            //   onClick={() => onDeleteBanner(value)}
                            className="w-6 h-6 bg-red-600 rounded flex justify-center items-center"
                          >
                            <MdDeleteOutline size={16} className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create size */}
        <div>
          <div className="bg-white flex justify-between mt-4">
            <h1 className="font-bold text-xl">Create Size</h1>
            <ButtonCustom onClick={openModalCreateSize} className="px-4 h-9">
              Create Size
            </ButtonCustom>
          </div>

          <div className="overflow-x-auto ">
            <table className="mt-4">
              <thead className="bg-gray-100">
                <tr>
                  {colorHeader.map((header, index) => (
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
                {productItem?.attributes[1]?.values.map((value, index) => {
                  const variant = productItem.variants.find((val) => {
                    return val.attributes.some(
                      (attribute) =>
                        attribute.attributeId === value.attributeId &&
                        attribute.attributeValue.value === value.value
                    );
                  });

                  return (
                    <tr key={index} className="hover:bg-gray-200">
                      <td>{index}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${value.image[0]?.imageUrl}`}
                        />
                      </td>
                      <td>{value.label}</td>
                      <td>{value.valueType}</td>
                      <td>{variant?.price}</td>
                      <td className="max-w-full">
                        {
                          <div className="flex gap-2">
                            {variant?.images?.map((image, index) => (
                              <CashImage
                                key={image.id}
                                imageUrl={`${config.BASE_URL}${image.imageUrl}`}
                                width={32}
                                height={32}
                              />
                            ))}
                          </div>
                        }
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            //   onClick={() => onEditBanner(value)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          <button
                            //   onClick={() => onDeleteBanner(value)}
                            className="w-6 h-6 bg-red-600 rounded flex justify-center items-center"
                          >
                            <MdDeleteOutline size={16} className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CenteredLoading loading={loading} />

      <AddProductColorModal
        isOpen={modalCreateColor}
        onClose={() => setModalCreateColor(false)}
        title={`Create ${modalType}`}
        onConfirm={onConfirmCreateColor}
      />
    </div>
  );
};

export default ProductDetailComponet;
