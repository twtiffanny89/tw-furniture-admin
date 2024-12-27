import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ButtonCustom from "../custom/ButtonCustom";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string; // Title prop for the dialog
  loading?: boolean;
  isNotCancel?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  loading = false,
  isNotCancel = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg pt-3.5 py-6 shadow-lg max-w-sm w-full"
            initial={{ y: "-100vh", scale: 0.8 }} // Start from the top
            animate={{ y: 0, scale: 1 }} // Move to center
            exit={{ y: "-100vh", scale: 0.8 }} // Exit to the top
            transition={{ duration: 0.3 }} // Adjust duration as needed
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            }} // Hover effect
          >
            <div className="flex items-center mb-2.5 px-6">
              <h2 className="text-lg font-semibold text-black">{title}</h2>
            </div>
            <hr className="my-2 border-gray-300" /> {/* Divider line */}
            <div className="px-6">
              <p className="text-lg mb-6 text-black">{message}</p>
              <div className="flex justify-end space-x-2">
                <ButtonCustom
                  onClick={onClose}
                  className="px-4 py-1"
                  variant="cancel"
                >
                  Cancel
                </ButtonCustom>
                <ButtonCustom
                  loading={loading}
                  onClick={onConfirm}
                  className={`px-4 py-1 ${
                    isNotCancel ? "" : "bg-red-600 hover:bg-red-700 "
                  }`}
                >
                  Confirm
                </ButtonCustom>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
