import React, { useState, useEffect, useRef } from "react";

let ethereum: any = null;
if (typeof window !== "undefined") {
  ethereum = window?.ethereum;
}

const Dropdown = ({
  isOpen,
  setIsOpen,
  options,
  handleClick,
  value,
}: {
  isOpen: any;
  setIsOpen: any;
  options: any;
  handleClick: any;
  value: any;
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: any = useRef(null);

  // Toggles the dropdown state
  const toggleDropdown = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Detects click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {options?.find((e: any) => e.value === value)?.id ??
            "Select Chain ID"}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {options?.map((e: any, i: any) => (
              <button
                key={i}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                role="menuitem"
                id="menu-item-0"
                onClick={() => {
                  handleClick(e);
                  setIsOpen(false);
                }}
              >
                {e?.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
