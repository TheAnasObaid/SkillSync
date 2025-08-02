import { FormEventHandler } from "react";

interface Props {
  children: React.ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const FormCard = ({
  children,
  onSubmit,
  isSubmitting,
  submitButtonText = "Save Changes",
}: Props) => {
  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md">
      <div className="card-body p-8">
        <form onSubmit={onSubmit} className="grid gap-6">
          {children}
          <div className="border-t border-base-300 pt-6">
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCard;
