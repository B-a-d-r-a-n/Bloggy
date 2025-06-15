// src/components/layout/NavBar.tsx
import { Link } from "@tanstack/react-router";

import { AuthNav } from "./AuthNav";
import { ThemeToggle } from "./ThemeToggle";

export default function NavBar() {
  // Define active props once for reuse
  const activeLinkProps = {
    className: "active font-bold", // DaisyUI's 'active' class usually adds a background color
  };

  const navLinks = (
    <>
      <li>
        <Link
          to="/"
          activeProps={activeLinkProps}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
      </li>
      <li>
        <Link to="/articles" activeProps={activeLinkProps}>
          Articles
        </Link>
      </li>
      <li>
        <Link to="/about" activeProps={activeLinkProps}>
          About
        </Link>
      </li>
    </>
  );
  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-40">
      {/* START: Contains mobile hamburger and the site title */}
      <div className="navbar-start">
        {/* Mobile Dropdown Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>

        {/* --- CHANGE: Site Title is now permanently here and has no responsive classes --- */}
        <Link to="/" className="btn btn-ghost text-xl normal-case">
          MyBlog
        </Link>
      </div>

      {/* CENTER: Contains only the desktop navigation links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      {/* END: Contains Theme Toggle & Auth Buttons. No changes needed. */}
      <div className="navbar-end gap-2">
        <ThemeToggle />
        <AuthNav />
      </div>
    </nav>
  );
}
