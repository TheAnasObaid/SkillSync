"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";

const RegisterForm = () => {
  const { form, isSubmitting, onSubmit } = useRegisterForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="label text-sm font-medium">Full Name</label>
        <input
          type="text"
          placeholder="e.g., John Doe"
          className="input input-bordered w-full"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-error text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="name@example.com"
          className="input input-bordered w-full"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-error text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="6+ characters"
          className="input input-bordered w-full"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-error text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label text-sm font-medium">I am a...</label>
        <select className="select select-bordered w-full" {...register("role")}>
          <option value="developer">Developer</option>
          <option value="client">Client</option>
        </select>
        {errors.role && (
          <p className="text-error text-xs">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full !mt-6" // Use !mt-6 for higher specificity
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
