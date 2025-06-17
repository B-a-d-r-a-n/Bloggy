import { type ChangeEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

// The allowed sort options, matching the type in the query hook
type SortOption = "newest" | "oldest" | "stars";

export function SortDropdown() {
  const navigate = useNavigate({ from: "/" });
  // Get the current search params
  const searchParams = useSearch({ from: "/" });

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSortValue = e.target.value as SortOption;

    // Navigate with the new search parameter, preserving existing ones like 'q' or 'category'
    navigate({
      search: (prev: {
        q?: string | undefined;
        category?: string | undefined;
        sort?: "newest" | "oldest" | "stars" | undefined;
      }) => ({ ...prev, sort: newSortValue }),
      replace: true, // Use replace to not clutter browser history with sort changes
    });
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Sort by</span>
      </label>
      <select
        className="select select-bordered"
        value={searchParams.sort || "newest"} // Default to 'newest' if not in URL
        onChange={handleSortChange}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="stars">Most Starred</option>
      </select>
    </div>
  );
}
