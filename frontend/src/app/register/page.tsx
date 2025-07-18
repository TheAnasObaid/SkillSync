import RegisterForm from "@/components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="grid gap-5 max-w-sm mx-auto my-10">
      <h2 className="text-4xl font-semibold">Register</h2>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
