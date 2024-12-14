import ButtonCustom from "@/components/custom/ButtonCustom";
import Input from "@/components/custom/Input";
import React from "react";
import { IoMdAdd } from "react-icons/io";

const ProductDetailComponet = () => {
  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product Detail</h1>
      </div>
      <div className="mt-4 bg-white min-h-full">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name Product
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input value={""} className="h-11" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subcategory
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input value={""} className="h-11" />
          </div>
        </div>

        <textarea
          name="description"
          rows={4}
          placeholder="Type your decri here..."
          className="w-full p-2 border rounded mt-4"
          style={{
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetailComponet;
