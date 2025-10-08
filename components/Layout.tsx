import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {
  SearchNormal,
  HambergerMenu,
  CloseSquare,
  MusicPlay,
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
            <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <MusicPlay size="20" color="#000" />
                </div>
                <span className="font-bold text-xl text-white">Inter-V</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                aria-label="Close menu"
              >
                <CloseSquare size="24" color="#ffffff" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar isMobile={true} user={user} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-[#171717]  px-4 py-6 z-40">
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
              <div className="text-2xl font-extrabold text-emerald-600">🚀 Inter-V</div>
            </div>

            <div className="flex items-center gap-4">
             
              <button
                onClick={() => signOut()}
                className="px-5 py-2 cursor-pointer rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="pt-20 p-4 lg:p-6 mt-10 md:mt-20">{children}</main>
      </div>
    </div>
  );
};

export default Layout;