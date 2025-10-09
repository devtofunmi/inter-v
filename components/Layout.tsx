import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {
  HambergerMenu,
} from "iconsax-react";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { status } = useSession();
  const { data, error } = useSWR(
    status === "authenticated" ? "/api/user" : null,
    fetcher
  );

  if (status === "loading" || (status === "authenticated" && !data)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  const { user } = data || {};

  return (
    <div className="flex bg-[#0d0d0d] min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-[#171717] transform transition-transform flex flex-col">           
            <div className="flex-1 overflow-hidden">
              <Sidebar isMobile={true} user={user} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-[#171717] md:hidden  px-4  z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                aria-label="Open menu"
              >
                <HambergerMenu color="#ffffff" size="24" />
              </button>
            </div>

            
          </div>
        </header>

        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default Layout;