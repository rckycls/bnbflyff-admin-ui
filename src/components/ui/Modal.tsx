// components/Modal.tsx
import React, { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { useItemTooltip } from "../../context/ItemTooltipContext";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
}

const getSizeClasses = (size: ModalSize) => {
  switch (size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-3xl";
    case "full":
      return "w-full h-full sm:rounded-none sm:h-auto sm:max-w-3xl";
    default:
      return "max-w-md";
  }
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const { modalRef } = useItemTooltip();
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="modal fixed inset-0 z-50 flex items-center justify-center bg-surface/40 bg-opacity-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-surface rounded-2xl shadow-lg w-full mx-4 sm:mx-0 ${getSizeClasses(
          size
        )} p-6 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-brand">{title}</h2>
        )}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
