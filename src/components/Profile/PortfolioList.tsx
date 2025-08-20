"use client";

import { useDeletePortfolioItemMutation } from "@/hooks/mutations/useProfileMutations";
import { PortfolioItem } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import PortfolioCard from "./PortfolioCard";

interface Props {
  initialPortfolio: PortfolioItem[];
  profileOwnerId: string;
}

const PortfolioList = ({ initialPortfolio, profileOwnerId }: Props) => {
  const { data: session } = useSession();
  const loggedInUser = session?.user;

  const isOwner = loggedInUser?.id === profileOwnerId;

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: PortfolioItem | null;
  }>({ isOpen: false, item: null });
  const { mutate: deleteItem, isPending: isDeleting } =
    useDeletePortfolioItemMutation();

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      deleteItem(deleteModal.item.id, {
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
                key={item.id}
                item={item}
                isOwner={isOwner}
                onDelete={() => setDeleteModal({ isOpen: true, item })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-base-content/70 py-10">
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
        icon={<FiTrash2 size={48} />}
      />
    </>
  );
};

export default PortfolioList;
