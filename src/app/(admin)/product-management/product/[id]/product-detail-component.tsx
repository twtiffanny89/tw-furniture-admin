"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import DropDownMenu from "@/components/custom/drop_down_menu";
import Input from "@/components/custom/Input";
import DropDownSubCategory from "@/components/drop-down/drop-down-sub-dategory";
import showToast from "@/components/error-handle/show-toast";
import AddProductColorModal from "@/components/modal/add-product-color-modal";
import { eventHeader } from "@/constants/data/header_table";
import {
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
import { debounce } from "@/utils/debounce/debounce";
import React, { useCallback, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);

  //   Step2

  const [ProductItem, setProductItem] = useState<ProductDetailModel | null>(
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
      productId: "cm4p46zi4000bp90rag04clku",
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
    console.log("### ====aahah", value);
    const response = await createSubAttributeService;
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

        <div className="bg-white flex justify-between mt-4">
          <h1 className="font-bold text-xl">Create Color</h1>
          <ButtonCustom onClick={onCreateProduct} className="px-4 h-9">
            Create Color
          </ButtonCustom>
        </div>

        <table className="mt-4">
          <thead className="bg-gray-100">
            <tr>
              {eventHeader.map((header, index) => (
                <th
                  key={header + index.toString()}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <AddProductColorModal
        isOpen={true}
        onClose={() => {}}
        title="Create color"
        onConfirm={onConfirmCreateColor}
      />
    </div>
  );
};

export default ProductDetailComponet;
