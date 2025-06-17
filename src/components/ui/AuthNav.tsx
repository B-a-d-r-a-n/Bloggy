import { Link } from "@tanstack/react-router";
import { getUserAvatar } from "../../lib/utils";
import { useCurrentUser, useLogout } from "../../features/auth/queries";

import toast from "react-hot-toast";
import { api } from "../../lib/api";
export function AuthNav() {
  const { data: user } = useCurrentUser(); // <-- The new hook
  const logout = useLogout();
  const handleLogout = async () => {
    try {
      await logout();
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token"); // 👈 remove on logout
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show a toast notification here
      toast.error("Logout failed, please try again");
    }
  };
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

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar placeholder"
      >
        <div className="w-10 rounded-full ring ...">
          <img
            alt="User Avatar"
            src={getUserAvatar(user.name, user.avatarUrl)}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <div className="menu-title">
          <span>Signed in as {user.name}</span>
        </div>
        <li>
          <Link params={{ userId: user._id }} to={`/profile/$userId`}>
            Profile
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
