import Link from "next/link";
import { PiDevToLogo } from "react-icons/pi";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="font-semibold text-xl flex flex-row">
          <PiDevToLogo size={44} className="text-primary" />
        </Link>
      </div>
      <ul className="navbar-end space-x-3">
        <li>
          <Link href="/login" className="btn btn-secondary">
            Login
          </Link>
        </li>
        <li>
          <Link href="/register" className="btn btn-primary">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
