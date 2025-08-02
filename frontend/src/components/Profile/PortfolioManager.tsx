"use client";

import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import PortfolioCard from "./PortfolioCard";
import ConfirmationModal from "../Common/ConfirmationModal";
import { FiPlus, FiX } from "react-icons/fi";
import { TextInput, Textarea, FileInput } from "../Forms/FormFields";
import toast from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { IPortfolioItem, PortfolioFormData } from "@/types";

interface PortfolioManagerProps {
  initialPortfolio: IPortfolioItem[];
  onPortfolioUpdate: (updatedPortfolio: IPortfolioItem[]) => void;
}

const PortfolioManager = ({
  initialPortfolio,
  onPortfolioUpdate,
}: PortfolioManagerProps) => {
  const [portfolio, setPortfolio] =
    useState<IPortfolioItem[]>(initialPortfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as IPortfolioItem | null,
  });
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  const formMethods = useForm<PortfolioFormData>();
  const { handleSubmit, reset } = formMethods;
  const isSubmitting = formMethods.formState.isSubmitting;

  // --- API HANDLERS ---
  const handleAddProject: SubmitHandler<PortfolioFormData> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.liveUrl) formData.append("liveUrl", data.liveUrl);
    if (data.githubUrl) formData.append("githubUrl", data.githubUrl);
    if (data.portfolioImage?.[0])
      formData.append("portfolioImage", data.portfolioImage[0]);

    const toastId = toast.loading("Adding project...");
    setIsActionInProgress(true);
    try {
      const response = await apiClient.post<IPortfolioItem[]>(
        "/users/me/portfolio",
        formData
      );
      onPortfolioUpdate(response.data); // Update parent state
      setPortfolio(response.data); // Update local state
      toast.success("Project added!", { id: toastId });
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to add project.", { id: toastId });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteModal.item) return;
    const toastId = toast.loading("Deleting project...");
    setIsActionInProgress(true);
    try {
      await apiClient.delete(`/users/me/portfolio/${deleteModal.item._id}`);
      const updatedPortfolio = portfolio.filter(
        (p) => p._id !== deleteModal.item?._id
      );
      onPortfolioUpdate(updatedPortfolio);
      setPortfolio(updatedPortfolio);
      toast.success("Project deleted.", { id: toastId });
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      toast.error("Failed to delete project.", { id: toastId });
    } finally {
      setIsActionInProgress(false);
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

      {portfolio.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <PortfolioCard
              key={item._id}
              item={item}
              onDelete={() => setDeleteModal({ isOpen: true, item })}
              isOwner={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-base-200/50 border border-dashed rounded-lg">
          <p className="text-base-content/60">Your portfolio is empty.</p>
        </div>
      )}

      {/* Add Project Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-4">Add New Project</h3>
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit(handleAddProject)}
              className="grid gap-4"
            >
              <TextInput name="title" label="Project Title" />
              <Textarea name="description" label="Description" rows={3} />
              <TextInput
                name="liveUrl"
                label="Live URL (Optional)"
                type="url"
              />
              <TextInput
                name="githubUrl"
                label="GitHub URL (Optional)"
                type="url"
              />
              <FileInput name="portfolioImage" label="Project Image" />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "Add Project"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.item?.title}"?`}
        onConfirm={handleDeleteProject}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
        confirmText="Yes, Delete"
        confirmButtonClass="btn-error"
        isActionInProgress={isActionInProgress}
      />
    </>
  );
};

export default PortfolioManager;
