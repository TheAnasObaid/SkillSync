import RegisterForm from "@/components/Auth/RegisterForm";
import AuthLayout from "@/components/Layout/AuthLayout";

const RegisterPage = () => {
  return (
    <AuthLayout>
      <div className="grid gap-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Your SkillSync Account</h1>
          <div className="divider" />
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
