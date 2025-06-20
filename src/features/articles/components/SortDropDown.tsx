import { type ChangeEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
type SortOption = "newest" | "oldest" | "stars";
export function SortDropdown() {
  const navigate = useNavigate({ from: "/" });
  const searchParams = useSearch({ from: "/" });
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSortValue = e.target.value as SortOption;
    navigate({
      search: (prev: {
        q?: string | undefined;
        category?: string | undefined;
        sort?: "newest" | "oldest" | "stars" | undefined;
      }) => ({ ...prev, sort: newSortValue }),
      replace: true, //to not clutter browser history with sort changes
    });
  };
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Sort by</span>
      </label>
      <select
        className="select select-bordered"
        value={searchParams.sort || "newest"}
        onChange={handleSortChange}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="stars">Most Starred</option>
      </select>
    </div>
  );
}
