import { ProfileFormData } from "@/app/developer/dashboard/profile/page";
import { useForm } from "react-hook-form";

interface ProfileEditFormProps {
  defaultValues: ProfileFormData;
  onFormSubmit: (data: ProfileFormData) => Promise<void>;
  isSubmitting: boolean;
}

const ProfileEditForm = ({
  defaultValues,
  onFormSubmit,
  isSubmitting,
}: ProfileEditFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: defaultValues,
  });

  return (
    <div className="card bg-base-200/50 border border-base-300 p-8">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* The entire JSX for your form from the previous step goes here */}
        {/* I will include it for completeness */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                className="input w-full bg-transparent focus:outline-none"
                {...register("name", { required: "First name is required" })}
              />
            </fieldset>
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                className="input w-full bg-transparent focus:outline-none"
                {...register("profile.lastName")}
              />
            </fieldset>
          </div>
        </div>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Address</legend>
            <input
              type="email"
              className="input w-full bg-transparent focus:outline-none"
              {...register("email", { required: "Email is required" })}
            />
          </fieldset>
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Bio</legend>
            <textarea
              className="textarea w-full bg-transparent focus:outline-none h-24"
              {...register("profile.bio")}
            ></textarea>
          </fieldset>
        </div>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Skills</legend>
            <input
              type="text"
              className="input w-full bg-transparent focus:outline-none"
              placeholder="React, Node.js, Python"
              {...register("profile.skills")}
            />
          </fieldset>
          <p className="text-xs text-base-content/60 mt-2">
            Enter skills separated by commas.
          </p>
        </div>
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
  );
};

export default ProfileEditForm;
