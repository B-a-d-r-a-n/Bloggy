import { useEffect } from "react";
import ReactDOM from "react-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";
import type { ReactNode } from "@tanstack/react-router";

type ModalIntent = "danger" | "warning";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  isConfirming?: boolean;
  intent?: ModalIntent;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  isConfirming = false,
  intent = "danger",
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const intentClasses = {
    iconContainer: intent === "danger" ? "bg-error/10" : "bg-warning/10",
    icon: intent === "danger" ? "text-error" : "text-warning",
    confirmButton: intent === "danger" ? "btn-error" : "btn-warning",
  };

  return ReactDOM.createPortal(
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full",
              intentClasses.iconContainer
            )}
          >
            <ExclamationTriangleIcon
              className={cn("h-6 w-6", intentClasses.icon)}
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-base-content">{title}</h3>
            <div className="mt-2 text-sm text-base-content/80">
              {description}
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            className={cn("btn", intentClasses.confirmButton)}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>,
    document.body
  );
}
