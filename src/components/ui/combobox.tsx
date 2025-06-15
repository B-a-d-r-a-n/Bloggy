import { useState } from "react";

import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Define the shape of a single option
export interface ComboboxOption {
  _id: string;
  name: string;
}

// Define the props for the component
interface ComboboxProps {
  options: ComboboxOption[];
  value: ComboboxOption | null;
  onChange: (value: ComboboxOption | null) => void;
  placeholder?: string;
}

export default function Combobox({
  value,
  onChange,
  options,
  placeholder,
}: ComboboxProps) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HeadlessCombobox value={value} onChange={onChange} nullable>
      <div className="relative">
        <HeadlessCombobox.Input
          className="input input-bordered w-full pr-10"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: ComboboxOption) => option?.name || ""}
          placeholder={placeholder || "Select an option..."}
        />
        <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </HeadlessCombobox.Button>
        <HeadlessCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
          {filteredOptions.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <HeadlessCombobox.Option
                key={option._id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-primary text-primary-content"
                      : "text-base-content"
                  }`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    {/* --- THIS IS THE FIX --- */}
                    {/* 
                      `block` ensures it takes the full width of the list item.
                      `truncate` applies overflow:hidden, text-overflow:ellipsis, and whitespace:nowrap
                      to prevent long category names from breaking the layout.
                    */}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-primary"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </HeadlessCombobox.Option>
            ))
          )}
        </HeadlessCombobox.Options>
      </div>
    </HeadlessCombobox>
  );
}
