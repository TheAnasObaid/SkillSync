"use client";

import { useState } from "react";
import { PortfolioItem } from "@/types";
import PortfolioCard from "./PortfolioCard";
import ConfirmationModal from "../Common/ConfirmationModal";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface PortfolioListProps {
  initialPortfolio: PortfolioItem[];
  profileOwnerId: string;
}

const PortfolioList = ({
  initialPortfolio,
  profileOwnerId,
}: PortfolioListProps) => {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    itemToDelete: null as PortfolioItem | null,
  });

  const { user: loggedInUser } = useAuthStore();

  const isOwner = loggedInUser?._id === profileOwnerId;

  const openDeleteModal = (item: PortfolioItem) => {
    setModalState({ isOpen: true, itemToDelete: item });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.itemToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(
        `/users/me/portfolio/${modalState.itemToDelete._id}`
      );
      setPortfolio(
        portfolio.filter((p) => p._id !== modalState.itemToDelete?._id)
      );
      alert("Project deleted successfully.");
    } catch (error) {
      alert("Failed to delete project.");
    } finally {
      setIsDeleting(false);
      setModalState({ isOpen: false, itemToDelete: null });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Portfolio</h2>
        {portfolio.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <PortfolioCard
                key={item._id}
                item={item}
                isOwner={isOwner}
                onDelete={() => openDeleteModal(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-base-content/70">
            <p>
              This developer hasn't added any projects to their portfolio yet.
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${modalState.itemToDelete?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalState({ isOpen: false, itemToDelete: null })}
        confirmText="Yes, Delete"
        confirmButtonClass="btn-error"
        isActionInProgress={isDeleting}
      />
    </>
  );
};

export default PortfolioList;
