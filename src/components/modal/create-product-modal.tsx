/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import Input from "../custom/Input";
import MessgaeError from "../error-handle/message_error";
import ButtonCustom from "../custom/ButtonCustom";
import { AttributeModel } from "@/redux/model/attribute-model/attribute-model";

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  initialData?: AttributeModel | null;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: AttributeModalProps) => {
  const [attribudeValueName, setAttribudeValueName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setAttribudeValueName(initialData.name);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!attribudeValueName) newErrors.attribudeValueName = "Name is required.";
    if (!price) newErrors.price = "Price is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm({ attribudeValueName, price });
  };

  const resetForm = () => {
    setAttribudeValueName("");
    setErrors({});
  };

  function onCloseFrom() {
    onClose();
  }

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
          <div className="my-4 ">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Attribude value
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input attribute value ..."
              value={attribudeValueName}
              onChange={(e) => {
                setAttribudeValueName(e.target.value);
                setErrors((prev) => ({ ...prev, attribudeValueName: "" }));
              }}
              required
              className="h-11"
            />
            {errors.attribudeValueName && (
              <MessgaeError message={errors.attribudeValueName} type="error" />
            )}
          </div>

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

export default CreateProductModal;
