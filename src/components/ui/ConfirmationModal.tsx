import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isConfirming?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  isConfirming = false,
}: ConfirmationModalProps) {
  return (
    <dialog id="confirmation_modal" className="modal" open={isOpen}>
      <div className="modal-box">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error/10">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-error"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-base-content">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-base-content/80">{description}</p>
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
            className="btn btn-error"
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
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
