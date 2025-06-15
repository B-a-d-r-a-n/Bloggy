// src/components/layout/AuthNav.tsx
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth"; // Adjust path if needed

export function AuthNav() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <>
        <Link to="/login" className="btn btn-ghost">
          Login
        </Link>
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </>
    );
  }
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar placeholder"
      >
        {user.avatarUrl ? (
          // If there IS an avatar, show it
          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img alt="User Avatar" src={user.avatarUrl} />
          </div>
        ) : (
          // If there is NO avatar, show the placeholder with initials
          <div className="bg-neutral text-neutral-content rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
            <span className="text-xl">{initials}</span>
          </div>
        )}
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <div className="menu-title">
          <span>Signed in as {user.name}</span>
        </div>
        <li>
          <Link to="/profile/dashboard">Profile</Link>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
