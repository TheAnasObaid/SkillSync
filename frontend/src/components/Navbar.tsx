import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="link link-hover font-semibold text-xl">
          DevsGoneWild
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
