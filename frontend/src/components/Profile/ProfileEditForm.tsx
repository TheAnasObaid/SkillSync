import { FormEventHandler, ReactNode } from "react";

// The props are now simplified. It doesn't need to know about form data types.
interface ProfileEditFormProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
}

const ProfileEditForm = ({
  children,
  onSubmit,
  isSubmitting,
}: ProfileEditFormProps) => {
  return (
    // This is the reusable "shell" with the card styling
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* It renders whatever fields the parent component passes into it */}
          {children}

          {/* The save button is also part of the shell */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
