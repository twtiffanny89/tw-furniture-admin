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
import { SubAttributeModel } from "@/redux/model/sub-attribute-model/sub-attribute-model";

interface SubAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: string) => void;
  title: string;
  initialData?: SubAttributeModel | null;
}

const SubAttributeModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: SubAttributeModalProps) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.label);
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
    if (!name) newErrors.name = "Name is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm(name);
  };

  const resetForm = () => {
    setName("");
    setErrors({});
  };

  async function onCloseFrom() {
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
              Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input attribute name..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              required
              className="h-11"
            />
            {errors.name && <MessgaeError message={errors.name} type="error" />}
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

export default SubAttributeModal;
