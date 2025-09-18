
import React, { useState, useRef, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';

const UserDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [dropdownRef]);

  return (
    <div className="relative flex items-center space-x-4 text-gray-400">
      <button
        className="p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <UserCircle size={24} />
      </button>
      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
          <button
            onClick={handleLogout}
            className="block px-4 py-2 cursor-pointer text-sm text-red-300 hover:bg-gray-700 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
