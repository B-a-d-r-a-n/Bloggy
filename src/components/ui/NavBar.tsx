import { Link } from "@tanstack/react-router";
import { AuthNav } from "./AuthNav";
import { ThemeToggle } from "./ThemeToggle";
export default function NavBar() {
  const navLinks = (
    <>
      {/* <li>
        <Link
          to="/"
          activeProps={activeLinkProps}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
      </li> */}
      {/* <li>
        <Link to="/articles" activeProps={activeLinkProps}>
          Articles
        </Link>
      </li> */}
      {/* <li>
        <Link to="/about" activeProps={activeLinkProps}>
          About
        </Link>
      </li> */}
    </>
  );
  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-40">
      {}
      <div className="navbar-start">
        {}
        {}
        {}
        <Link to="/" className="btn btn-ghost text-xl normal-case">
          Bloggy
        </Link>
      </div>
      {}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      {}
      <div className="navbar-end gap-2">
        <ThemeToggle />
        <AuthNav />
      </div>
    </nav>
  );
}
