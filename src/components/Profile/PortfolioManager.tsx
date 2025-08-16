"use client";

import {
  useAddPortfolioItemMutation,
  useDeletePortfolioItemMutation,
} from "@/hooks/mutations/useProfileMutations";
import { DeveloperPortfolioFormData, IPortfolioItem } from "@/types";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import Modal from "../Common/Modal";
import { FileInput, TextInput, Textarea } from "../Forms/FormFields";
import PortfolioCard from "./PortfolioCard";

interface Props {
  initialPortfolio: IPortfolioItem[];
}

const PortfolioManager = ({ initialPortfolio }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as IPortfolioItem | null,
  });

  const { mutate: addItem, isPending: isAdding } =
    useAddPortfolioItemMutation();
  const { mutate: deleteItem, isPending: isDeleting } =
    useDeletePortfolioItemMutation();

  const formMethods = useForm<DeveloperPortfolioFormData>();

  const handleAddSubmit: SubmitHandler<DeveloperPortfolioFormData> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.liveUrl) formData.append("liveUrl", data.liveUrl);
    if (data.githubUrl) formData.append("githubUrl", data.githubUrl);
    if (data.portfolioImage?.[0])
      formData.append("portfolioImage", data.portfolioImage[0]);

    addItem(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        formMethods.reset();
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      deleteItem(deleteModal.item._id!, {
        onSuccess: () => setDeleteModal({ isOpen: false, item: null }),
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Portfolio</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {initialPortfolio.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPortfolio.map((item) => (
            <PortfolioCard
              key={item._id}
              item={item}
              onDelete={() => setDeleteModal({ isOpen: true, item })}
              isOwner={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-base-200/50 border border-base-300 rounded-lg">
          <p className="text-base-content/60">
            Your portfolio is empty. Add your first project!
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Portfolio Project"
      >
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleAddSubmit)}
            className="grid gap-4"
          >
            <TextInput name="title" label="Project Title" required />
            <Textarea
              name="description"
              label="Description"
              rows={3}
              required
            />
            <TextInput name="liveUrl" label="Live URL (Optional)" type="url" />
            <TextInput
              name="githubUrl"
              label="GitHub URL (Optional)"
              type="url"
            />
            <FileInput name="portfolioImage" label="Project Image" required />
            <div className="modal-action mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost"
                disabled={isAdding}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAdding}
              >
                {isAdding ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Add Project"
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </Modal>

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

export default PortfolioManager;
