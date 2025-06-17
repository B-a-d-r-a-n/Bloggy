import { Link } from "@tanstack/react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded-t-lg mt-16">
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
      <aside>
        <p>Copyright © {currentYear} - All right reserved by Mohamed Badran</p>
      </aside>
    </footer>
  );
}
