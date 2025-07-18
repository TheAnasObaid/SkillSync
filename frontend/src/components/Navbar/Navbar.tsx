import Link from "next/link";
import { SiDailydotdev } from "react-icons/si";
import ButtonGroup from "./ButtonGroup";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-start">
        <Link href="/" className="font-semibold text-xl flex flex-row">
          <SiDailydotdev size={44} className="text-secondary" />
        </Link>
      </div>
      <div className="navbar-end">
        <ButtonGroup />
      </div>
    </nav>
  );
};

export default Navbar;
