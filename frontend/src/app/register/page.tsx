import RegisterForm from "@/components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="grid gap-5 max-w-sm w-full my-10 mx-auto">
      <h1 className="text-center text-2xl font-bold border-b border-base-300/100 pb-10">
        Create Your SkillSync Account
      </h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
