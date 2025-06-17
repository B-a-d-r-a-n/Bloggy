import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useGetCategories } from "../../shared/queries";
import { FormSelect } from "../../../components/ui/FormSelect";

// Define the type for search and sort state
type SearchAndSortState = {
  q: string;
  category: string;
  sort: "newest" | "oldest" | "stars";
};

export function SearchFilter() {
  const navigate = useNavigate({ from: "/" });
  // Get all current search params from the URL
  const currentParams = useSearch({ from: "/" });
  const { data: categories = [] } = useGetCategories();

  // Manage the form's state locally
  const [formState, setFormState] = useState<SearchAndSortState>({
    q: currentParams.q || "",
    category: currentParams.category || "",
    sort: currentParams.sort || "newest",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // On submit, navigate with the new search params
    navigate({
      search: {
        q: formState.q || undefined, // Send undefined to remove from URL
        category: formState.category || undefined,
        sort: formState.sort,
      },
      replace: true,
    });
    // Close the drawer
    const checkbox = document.getElementById(
      "search-drawer-checkbox"
    ) as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  const handleClear = () => {
    const clearedState = { q: "", category: "", sort: "newest" as const };
    setFormState(clearedState);
    navigate({ search: clearedState, replace: true });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6">Search & Filter</h3>

      <form onSubmit={handleSearch} className="flex-grow flex flex-col gap-6">
        {/* Search Input */}
        <div>
          <label
            htmlFor="search-q"
            className="block text-sm font-medium text-base-content/90 mb-1.5"
          >
            Search by keyword
          </label>
          <input
            id="search-q"
            name="q"
            type="text"
            placeholder="e.g., Mangoes, React..."
            className="input input-bordered w-full"
            value={formState.q}
            onChange={handleInputChange}
          />
        </div>

        {/* Category Select */}
        <FormSelect
          label="Filter by Category"
          name="category"
          value={formState.category}
          onChange={handleInputChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </FormSelect>

        {/* --- SORTING DROPDOWN--- */}
        <FormSelect
          label="Sort By"
          name="sort"
          value={formState.sort}
          onChange={handleInputChange}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="stars">Most Starred</option>
        </FormSelect>

        {/* Spacer to push buttons to the bottom */}
        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow">
            <MagnifyingGlassIcon className="w-5 h-5" />
            Apply
          </button>
          <button type="button" onClick={handleClear} className="btn btn-ghost">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export function SearchFilterFAB() {
  return (
    <div className="drawer drawer-end">
      {/* Hidden checkbox to control the drawer state */}
      <input
        id="search-drawer-checkbox"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* The floating button that opens the drawer */}
      <div className="drawer-content fixed top-20 left-6 z-50">
        <label
          htmlFor="search-drawer-checkbox"
          className="btn btn-primary btn-lg normal-case shadow-lg"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
          <span className="hidden md:inline ml-2">Looking for something?</span>
        </label>
      </div>

      {/* The sidebar content */}
      <div className="drawer-side z-[60]">
        <label
          htmlFor="search-drawer-checkbox"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="p-4 w-80 min-h-full bg-base-100 text-base-content">
          <SearchFilter />
        </div>
      </div>
    </div>
  );
}
