import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ButtonCustom from "../custom/ButtonCustom";
interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const ModalConfirmLogout = ({
  isOpen,
  onClose,
  onConfirm,
}: ModalConfirmProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to logout?</DialogTitle>
          <DialogDescription>
            Please click confirm if you want logout
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 mt-8">
          <ButtonCustom
            onClick={onClose}
            className="px-4 py-1"
            variant="cancel"
          >
            Cancel
          </ButtonCustom>
          <ButtonCustom
            onClick={onConfirm}
            className="px-4 py-1 bg-red-600 hover:bg-red-700"
          >
            Confirm
          </ButtonCustom>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmLogout;
