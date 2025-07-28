import RegisterForm from "@/components/Auth/RegisterForm";
import AuthLayout from "@/components/Layout/AuthLayout";

const RegisterPage = () => {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Your SkillSync Account</h1>
      </div>
      <div className="divider my-6" />
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
