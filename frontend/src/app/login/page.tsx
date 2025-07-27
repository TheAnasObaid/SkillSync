import LoginForm from "@/components/Auth/LoginForm";
import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";

const LoginPage = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] my-5">
      <Link href="/" className="w-fit tab justify-start">
        <IoReturnUpBack size={24} />
      </Link>
      <div className="grid gap-5 w-full max-w-sm mx-auto my-10">
        <h2 className="text-4xl font-semibold">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
