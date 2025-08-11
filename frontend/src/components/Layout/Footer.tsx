import Link from "next/link";
import { FiTwitter, FiGithub, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-xl mx-auto px-4 py-3 mt-10">
      <div className="bg-base-200/50 border border-base-300 p-8 rounded-lg">
        {/* Use DaisyUI's footer component for structured content */}
        <footer className="footer text-base-content grid grid-cols-4">
          {/* Column 1: Branding and Copyright */}
          <aside>
            <Link href="/" className="text-2xl font-bold">
              Skill<span className="text-primary">Sync</span>
            </Link>
            <p className="text-base-content/70">
              SkillSync Ltd.
              <br />
              Connecting talent with opportunity through code.
            </p>
            <p className="text-xs text-base-content/50 mt-4">
              &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
            </p>
          </aside>

          {/* Column 2: Navigation Links */}
          <nav>
            <h6 className="footer-title">Platform</h6>
            <Link href="/challenges" className="link link-hover">
              Challenges
            </Link>
            <Link href="/pricing" className="link link-hover">
              Pricing
            </Link>
          </nav>

          {/* Column 3: Company Links */}
          <nav>
            <h6 className="footer-title">Company</h6>
            <Link href="/about" className="link link-hover">
              About Us
            </Link>
          </nav>

          {/* Column 4: Legal Links */}
          <nav>
            <h6 className="footer-title">Legal</h6>
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy
            </Link>
          </nav>
        </footer>

        {/* --- Social Links & Divider --- */}
        <div className="divider"></div>
        <div className="flex justify-center items-center">
          <div className="grid grid-flow-col gap-4">
            <a href="#" className="btn btn-ghost btn-circle">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="btn btn-ghost btn-circle">
              <FiGithub size={18} />
            </a>
            <a href="#" className="btn btn-ghost btn-circle">
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
