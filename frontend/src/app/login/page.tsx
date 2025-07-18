import LoginForm from "@/components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="grid gap-5 max-w-sm mx-auto my-10">
      <h2 className="text-4xl font-semibold">Login</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
