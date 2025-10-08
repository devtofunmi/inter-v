import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home2,
  MusicPlay,
  Setting,
} from "iconsax-react";

interface SidebarProps {
  isMobile?: boolean;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, user }) => {
  const router = useRouter();
  
  const navItems = [
    { name: "Home", icon: Home2, href: "/dashboard" },
    { name: "Interview", icon: MusicPlay, href: "/practice" },
  ];

  return (
    <aside className={`${isMobile ? 'w-full bg-transparent' : 'w-full bg-[#171717] '} p-6 h-full overflow-y-auto flex flex-col`}>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg  ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon
                    size="20"
                    color={isActive ? "#ffffff" : "#9ca3af"}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium group-hover:scale-110 transition-transform">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-600">
        <div className="mb-4">
          <Link
            href="/settings"
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${
              router.pathname === '/settings' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-gray-800/50'
            }`}
          >
            <Setting 
              size="20" 
              color={router.pathname === '/settings' ? "#ffffff" : "#9ca3af"} 
              className="group-hover:scale-110 transition-transform" 
            />
            <span className="font-medium group-hover:scale-110 transition-transform">Settings</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 text-white">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="font-medium">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <span className="font-medium">{user?.name || 'User'}</span>
        </div>
       
      </div>
    </aside>
  );
};

export default Sidebar;
