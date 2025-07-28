import LoginForm from "@/components/Auth/LoginForm";
import AuthLayout from "@/components/Layout/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back to SkillSync</h1>
        <p className="mt-2 text-base-content/60">
          Enter your credentials to access your dashboard.
        </p>
      </div>
      <div className="divider my-8"></div>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
