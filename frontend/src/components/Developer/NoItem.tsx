import Link from "next/link";
import { FiFilePlus } from "react-icons/fi";

const NoItemFound = () => (
  <div className="text-center p-12 bg-base-200/50 border border-dashed border-base-300 rounded-lg">
    <FiFilePlus className="mx-auto text-5xl text-base-content/40 mb-4" />
    <h3 className="text-2xl font-bold">No Submissions Yet</h3>
    <p className="text-base-content/70 mt-2 mb-6">
      Your journey to prove your skills starts with the first challenge.
    </p>
    <Link href="/" className="btn btn-primary">
      Find a Challenge to Solve
    </Link>
  </div>
);

export default NoItemFound;
