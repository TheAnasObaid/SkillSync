"use client";

import Modal from "./Modal";
import { ReactNode } from "react";
// Import a set of default/fallback icons
import { FiAlertTriangle, FiHelpCircle } from "react-icons/fi";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "error" | "warning" | "info";
  isActionInProgress?: boolean;
  icon?: ReactNode; // FIX: Add the optional icon prop
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isActionInProgress = false,
  icon, // FIX: Destructure the new prop
}: ConfirmationModalProps) => {
  const themeClasses = {
    primary: { button: "btn-primary", icon: "text-primary" },
    error: { button: "btn-error", icon: "text-error" },
    warning: { button: "btn-warning", icon: "text-warning" },
    info: { button: "btn-info", icon: "text-info" },
  };

  // FIX: Define default icons to use if a specific one isn't provided
  const getDefaultIcon = () => {
    switch (variant) {
      case "error":
      case "warning":
        return <FiAlertTriangle size={48} />;
      case "primary":
      case "info":
      default:
        return <FiHelpCircle size={48} />;
    }
  };

  const currentTheme = themeClasses[variant];
  // FIX: Use the provided icon, or fall back to the default
  const displayIcon = icon || getDefaultIcon();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className={`mx-auto ${currentTheme.icon}`}>{displayIcon}</div>
        <p className="text-base-content/80">{message}</p>
        <div className="modal-action justify-center">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isActionInProgress}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${currentTheme.button}`}
            onClick={onConfirm}
            disabled={isActionInProgress}
          >
            {isActionInProgress ? (
              <span className="loading loading-spinner" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
