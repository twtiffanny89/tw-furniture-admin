"use client";
import React, { useState } from "react";

interface AttributeValue {
  id: string;
  valueType: string;
  value: string;
  label: string;
}

interface Variant {
  id: string;
  price: string;
  stock: number;
  attributes: { attributeValue: AttributeValue }[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  attributes: {
    attribute: { id: string; name: string };
    values: AttributeValue[];
  }[];
  variants: Variant[];
}

const staticProducts: Product[] = [
  {
    id: "cm4k1lgcj0000wayqkdjgibuq",
    name: "Huuger Nightstand with Charging Station",
    description:
      "Add 2 AC outlets, 1 USB port and 1 Type-C port, more charging spots for bedtime.",
    basePrice: 10,
    attributes: [
      {
        attribute: { id: "color", name: "Color" },
        values: [
          { id: "blue", valueType: "COLOR", value: "#0000FF", label: "Blue" },
          { id: "black", valueType: "COLOR", value: "#000000", label: "Black" },
        ],
      },
    ],
    variants: [
      {
        id: "variant1",
        price: "49",
        stock: 100,
        attributes: [
          {
            attributeValue: {
              id: "blue",
              valueType: "COLOR",
              value: "#0000FF",
              label: "Blue",
            },
          },
        ],
      },
      {
        id: "variant2",
        price: "59",
        stock: 10,
        attributes: [
          {
            attributeValue: {
              id: "black",
              valueType: "COLOR",
              value: "#000000",
              label: "Black",
            },
          },
        ],
      },
    ],
  },
];

const ProductManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 1;
  const totalPages = Math.ceil(staticProducts.length / productsPerPage);

  const currentProducts = staticProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 max-w-full">ID</th>
              <th className="px-4 py-2 max-w-full">Name</th>
              <th className="px-4 py-2 max-w-full">Description</th>
              <th className="px-4 py-2 max-w-full">Base Price</th>
              <th className="px-4 py-2 max-w-full">Variants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2 max-w-full">{product.id}</td>
                <td className="px-4 py-2 max-w-full">{product.name}</td>
                <td className="px-4 py-2 max-w-full">{product.description}</td>
                <td className="px-4 py-2 max-w-full">${product.basePrice}</td>
                <td className="px-4 py-2 max-w-full">
                  {product.variants.map((variant) => (
                    <div key={variant.id}>
                      Price: ${variant.price}, Stock: {variant.stock}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <button className="bg-blue-500 text-white px-3 py-1 mr-2 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <nav>
          <ul className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductManagement;
