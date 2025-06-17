import { Link } from "@tanstack/react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer p-10 bg-base-200 text-base-content rounded-t-lg mt-16">
      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4">
        {/* links section */}
        <nav className="grid grid-flow-col gap-4">
          <Link to="/about" className="link link-hover">
            About us
          </Link>
          <a
            href="https://www.linkedin.com/in/mohamed-ahmed-badran/"
            className="link link-hover"
          >
            Contact
          </a>
        </nav>

        {/* --- Copyright Section --- */}
        <aside className="text-sm text-base-content/70">
          <p>
            Copyright © {currentYear} - All rights reserved by Mohamed Badran
          </p>
        </aside>
      </div>
    </footer>
  );
}
