import Link from "next/link";
import { SiDailydotdev } from "react-icons/si";
import ButtonGroup from "./ButtonGroup";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar bg-base-100">
        <div className="navbar-start">
          <Link href="/" className="font-semibold text-xl flex flex-row">
            <SiDailydotdev size={44} className="text-primary" />
          </Link>
        </div>
        <div className="navbar-end">
          <ButtonGroup />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
