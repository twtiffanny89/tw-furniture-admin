import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "../custom/button";
interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const ModalConfirm = ({ isOpen, onClose, onConfirm }: ModalConfirmProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to deleted?</DialogTitle>
          <DialogDescription>
            Please click confirm if you want delete
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="px-4 py-1" variant="cancel">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-1 bg-red-600 hover:bg-red-700"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirm;
