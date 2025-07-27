import LoginForm from "@/components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="grid gap-5 w-full max-w-sm mx-auto my-10">
        <h2 className="text-4xl font-semibold">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
