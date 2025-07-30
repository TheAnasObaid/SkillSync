"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isActionInProgress?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "btn-primary",
  isActionInProgress = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open bg-black/30 backdrop-blur-sm">
      <div className="modal-box border border-base-300">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isActionInProgress}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${confirmButtonClass}`}
            onClick={onConfirm}
            disabled={isActionInProgress}
          >
            {isActionInProgress ? (
              <span className="loading loading-spinner"></span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
