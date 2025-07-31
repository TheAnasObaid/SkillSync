import Link from "next/link";
import { FiGitBranch, FiLogIn } from "react-icons/fi";

interface Props {
  role: string | null;
  onOpenModal: () => void;
}

const CtaBlock = ({ role, onOpenModal }: Props) => {
  if (role === "developer") {
    return (
      <button className="btn btn-primary btn-block" onClick={onOpenModal}>
        <FiGitBranch /> Submit Solution
      </button>
    );
  }

  if (role === "client") {
    return (
      <div className="alert alert-info text-center">
        <p>You are viewing this challenge as a client.</p>
      </div>
    );
  }

  return (
    <div className="alert alert-warning text-center">
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full"
      >
        <FiLogIn />
        <span>Log in as a Developer to Submit</span>
      </Link>
    </div>
  );
};

export default CtaBlock;
