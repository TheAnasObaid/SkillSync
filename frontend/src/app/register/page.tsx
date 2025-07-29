import RegisterForm from "@/components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="grid gap-5 max-w-md w-full mx-auto my-10 p-8 bg-base-200/50 border border-base-300 rounded-lg">
      <h1 className="text-center text-2xl font-bold border-b border-base-300/100 pb-10">
        Create Your SkillSync Account
      </h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
