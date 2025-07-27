import RegisterForm from "@/components/Auth/RegisterForm";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";

const RegisterPage = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] my-5">
      <Link href="/" className="w-fit tab justify-start">
        <IoReturnUpBack size={24} />
      </Link>
      <div className="grid gap-5 max-w-sm w-full mx-auto">
        <h2 className="text-4xl font-semibold">Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
