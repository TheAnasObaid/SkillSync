"use client";

import { useDeletePortfolioItemMutation } from "@/hooks/mutations/useProfileMutations";
import { useAuthStore } from "@/store/authStore";
import { IPortfolioItem } from "@/types";
import { useState } from "react";
import ConfirmationModal from "../Common/ConfirmationModal";
import PortfolioCard from "./PortfolioCard";

interface Props {
  initialPortfolio: IPortfolioItem[];
  profileOwnerId: string;
}

const PortfolioList = ({ initialPortfolio, profileOwnerId }: Props) => {
  const { user: loggedInUser } = useAuthStore();
  const isOwner = loggedInUser?._id === profileOwnerId;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as IPortfolioItem | null,
  });
  const { mutate: deleteItem, isPending: isDeleting } =
    useDeletePortfolioItemMutation();

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      deleteItem(deleteModal.item._id!, {
        onSuccess: () => setDeleteModal({ isOpen: false, item: null }),
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Portfolio</h2>
        {initialPortfolio.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPortfolio.map((item) => (
              <PortfolioCard
                key={item._id}
                item={item}
                isOwner={isOwner}
                onDelete={() => setDeleteModal({ isOpen: true, item })}
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
        isOpen={deleteModal.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.item?.title}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
        confirmText="Yes, Delete"
        variant="error"
        isActionInProgress={isDeleting}
      />
    </>
  );
};

export default PortfolioList;
