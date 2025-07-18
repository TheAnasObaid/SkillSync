import Container from "./Container";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <Container>
      <nav className="navbar">
        <div className="navbar-end">
          <ul className="flex gap-5 py-5 max-w-screen-xl mx-auto w-full">
            <li>
              <Link className="link link-neutral" href="/developer/dashboard">
                Developer
              </Link>
            </li>
            <li>
              <Link className="link link-neutral" href="/client/dashboard">
                Client
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </Container>
  );
};

export default Footer;
