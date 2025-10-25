import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PricingModal from "./practice/PricingModal";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data } = useSWR(
    status === "authenticated" ? "/api/user" : null,
    fetcher
  );

  if (status === "loading" || (status === "authenticated" && !data)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
      </div>
    );
  }

  const { user } = data || {};

  return (
    <div className="flex bg-gray-50 min-h-screen font-geist">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
        <Sidebar user={user} onOpenPricing={() => setShowPricingModal(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-white transform transition-transform flex flex-col">
              <div className="flex-1 overflow-y-auto">
              <Sidebar isMobile={true} user={user} onOpenPricing={() => setShowPricingModal(true)} />
            </div>
          </div>
        </div>
      )}

      {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        <header className="lg:hidden fixed top-0 right-0 left-0 bg-white border-b border-gray-200 px-4 h-16 flex items-center z-40">
          <div className="flex items-center justify-between w-full">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-blue-400 p-2 rounded-lg"
                aria-label="Open menu"
              >
                <Menu size="24" />
              </button>

          </div>
        </header>

        <main className="pt-16 lg:pt-0 min-h-screen mt-5 md:mt-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;