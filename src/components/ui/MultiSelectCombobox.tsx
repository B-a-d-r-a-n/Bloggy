import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import type { Tag } from "../../core/types/tag";
interface MultiSelectComboboxProps {
  options: Tag[];
  selected: Tag[];
  onChange: (selected: Tag[]) => void;
  placeholder?: string;
  onCreate: (tagName: string) => Promise<Tag | null>;
  isCreating: boolean;
}
export default function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder,
  onCreate,
  isCreating,
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState("");
  const handleCreate = async () => {
    if (query.trim() === "") return;
    const newTag = await onCreate(query.trim());
    if (newTag) {
      onChange([...selected, newTag]);
    }
    setQuery("");
  };
  const handleDeselect = (tagToRemove: Tag) => {
    onChange(selected.filter((s) => s._id !== tagToRemove._id));
  };
  const filteredOptions =
    query === ""
      ? options.filter((opt) => !selected.some((sel) => sel._id === opt._id))
      : options.filter(
          (option) =>
            !selected.some((sel) => sel._id === option._id) &&
            option.name.toLowerCase().includes(query.toLowerCase())
        );
  const exactMatchExists = options.some(
    (opt) => opt.name.toLowerCase() === query.toLowerCase().trim()
  );
  const showCreateOption = query.trim() !== "" && !exactMatchExists;
  return (
    <div>
      {/* Display Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] p-2 bg-base-200 rounded-md">
        {selected.length > 0 ? (
          selected.map((tag) => (
            <div key={tag._id} className="badge badge-lg badge-primary gap-2">
              {tag.name}
              <button
                type="button"
                onClick={() => handleDeselect(tag)}
                aria-label={`Remove ${tag.name}`}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <span className="text-base-content/50 px-2">Select tags...</span>
        )}
      </div>

      {/* Combobox */}
      <Combobox value={selected} onChange={onChange} multiple>
        <div className="relative">
          <Combobox.Input
            as="input"
            className="input input-bordered w-full pr-10"
            placeholder={placeholder || "Search or create tags..."}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCreateOption) {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-80 overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 min-w-0">
            {showCreateOption && (
              <li
                className="relative cursor-pointer select-none py-2 px-4 text-primary data-[hover]:bg-primary data-[hover]:text-primary-content"
                onClick={handleCreate}
              >
                <span className="font-bold break-all">Create "{query}"</span>
                {isCreating && (
                  <span className="loading loading-spinner loading-xs ml-2"></span>
                )}
              </li>
            )}
            {filteredOptions.length === 0 && !showCreateOption ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option._id}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-primary text-primary-content"
                        : "text-base-content"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      {}
                      <span
                        className={`block truncate ${
                          selected ? "font-bold" : "font-normal"
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
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
