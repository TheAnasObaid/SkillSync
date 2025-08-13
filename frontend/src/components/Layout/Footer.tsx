import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-xl mx-auto px-4 py-3 mt-10">
      <div className="bg-base-200/50 border border-base-300 p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* --- Column 1: Branding --- */}
          <aside className="md:col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold">
              Skill<span className="text-primary">Sync</span>
            </Link>
            <p className="text-base-content/70 mt-2">
              Connecting talent with opportunity through code.
            </p>
            <p className="text-xs text-base-content/50 mt-4">
              &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
            </p>
          </aside>

          {/* --- Column 2: Platform Links --- */}
          <nav className="flex flex-col gap-2">
            <h6 className="footer-title opacity-80">Platform</h6>
            <Link href="/challenges" className="link link-hover">
              Challenges
            </Link>
            <Link href="/pricing" className="link link-hover">
              Pricing
            </Link>
          </nav>

          {/* --- Column 3: Company Links --- */}
          <nav className="flex flex-col gap-2">
            <h6 className="footer-title opacity-80">Company</h6>
            <Link href="/about" className="link link-hover">
              About Us
            </Link>
            <Link href="/blog" className="link link-hover">
              Blog
            </Link>
          </nav>

          {/* --- Column 4: Legal Links --- */}
          <nav className="flex flex-col gap-2">
            <h6 className="footer-title opacity-80">Legal</h6>
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="link link-hover">
              Terms of Service
            </Link>
          </nav>
        </div>

        {/* --- Social Links (Separate Section) --- */}
        <div className="divider my-8"></div>
        <div className="flex justify-center items-center">
          <div className="grid grid-flow-col gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle"
              aria-label="Twitter"
            >
              <FiTwitter size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle"
              aria-label="GitHub"
            >
              <FiGithub size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
