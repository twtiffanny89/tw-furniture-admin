/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useState } from "react";
import ButtonCustom from "../custom/ButtonCustom";
import { Product, ProductListModel } from "@/redux/model/product/product-model";
import { debounce } from "@/utils/debounce/debounce";
import { getAllProductService } from "@/redux/action/product-management/product-service";
import DropDownProduct from "../drop-down/drop-down-product";
import MessgaeError from "../error-handle/message_error";

interface SubAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Product | null) => void;
  title: string;
  initialData?: Product | null;
}

const AddSuggestionModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: SubAttributeModalProps) => {
  const [productItem, setProductItem] = useState<Product | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchAdd, setSearchAdd] = useState("");
  const [productList, setProductList] = useState<ProductListModel>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProductItem(initialData);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    onCallApi({});
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!productItem) newErrors.product = "Product is required.";
    if (Object.keys(newErrors).length > 0 || !productItem) {
      setErrors(newErrors);
      return;
    }
    onConfirm(productItem);
  };

  const resetForm = () => {
    setProductItem(null);
    setErrors({});
  };

  async function onCloseFrom() {
    onClose();
  }

  function onItemSelect(value: Product) {
    setProductItem(value);
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
    const response = await getAllProductService({ page, search });
    setProductList(response);
  }

  const onLoadMore = async () => {
    setLoading(true);
    if (
      productList?.pagination &&
      productList.pagination!.currentPage < productList.pagination!.totalPages
    ) {
      const result = await getAllProductService({
        page: productList?.pagination!.currentPage + 1,
      });
      setProductList((prev) => ({
        data: [...prev!.data, ...result.data],
        pagination: result.pagination,
      }));
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseFrom}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onKeyDown={handleKeyPress}>
          <DropDownProduct
            onItemSelect={onItemSelect}
            onClearSearch={onClearSearch}
            value={searchAdd}
            dataList={productList?.data || []}
            onChange={onChange}
            label="Product"
            onLoadMore={onLoadMore}
            isLoading={loading}
            selectedOption={productItem}
            noNext={productList?.pagination?.nextPage != null}
          />
          {errors.product && (
            <MessgaeError message={errors.product} type="error" />
          )}

          <div className="flex justify-end space-x-2 mt-8">
            <ButtonCustom
              onClick={onCloseFrom}
              className="px-4 py-1.5"
              variant="cancel"
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              onClick={handleConfirm}
              className="px-4 py-1.5 transition"
            >
              Save
            </ButtonCustom>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSuggestionModal;
