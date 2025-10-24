import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutGrid,
  Mic,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    name?: string;
    image?: string;
  };
  onOpenPricing?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onOpenPricing, isMobile }) => {
  const router = useRouter();
  
  const navItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Practice", icon: Mic, href: "/practice" },
  ];

  return (
  <aside data-is-mobile={isMobile ? 'true' : 'false'} className={`p-6 h-full flex flex-col font-geist bg-white`}>
      <div className="text-xl font-extrabold text-emerald-600 mb-10">Prepkitty</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-600 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    size="20"
                    className="transition-transform"
                  />
                  <span className="transition-transform text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="mb-4">
          <button
            onClick={() => onOpenPricing && onOpenPricing()}
            className="w-full cursor-pointer text-left px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-600 font-semibold mb-3"
          >
            Get Unlimited Interviews
          </button>
        </div>
        <div className="mb-4">
          <Link
            href="/settings"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              router.pathname === '/settings' 
                ? 'bg-emerald-50 text-emerald-600 font-semibold' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings 
              size="20" 
              className="transition-transform" 
            />
            <span className="transition-transform text-base">Settings</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 text-gray-800 mb-4 p-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <Image src={user.image} alt="user" width={32} height={32} className="rounded-full" />
            ) : (
              <User size={16} className="text-gray-500" />
            )}
          </div>
          <span className="font-medium text-sm">{user?.name || 'User'}</span>
        </div>
       
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors duration-200"
        >
          <LogOut size="20" />
          <span className="font-medium text-base">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;