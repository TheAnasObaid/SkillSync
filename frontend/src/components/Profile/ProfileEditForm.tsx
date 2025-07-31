interface Props {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
}

const ProfileEditForm = ({ children, onSubmit, isSubmitting }: Props) => {
  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
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
