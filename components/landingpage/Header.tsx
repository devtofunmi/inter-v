
import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", text: "Features" },
  { href: "#testimonials", text: "Testimonials" },
  { href: "#faq", text: "FAQ" },
];

export const Header = () => {
  const [isSticky, setSticky] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const body = document.body;
    if (mobileNavOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'unset';
    }
  }, [mobileNavOpen]);

  const headerClasses = mobileNavOpen 
    ? "z-[51] fixed top-0 bg-white border-b border-gray-200"
    : isSticky 
    ? "z-40 fixed top-0 backdrop-blur-md bg-white/90 border-b border-gray-200" 
    : "z-40 bg-white";

  return (
    <header className={`flex justify-between items-center px-8 py-4 w-full ${headerClasses}`}>
      <div className="text-2xl font-extrabold text-emerald-600">Prepkitty</div>
      
      <nav className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-emerald-600 font-medium text-base">{link.text}</a>
        ))}
      </nav>
      
      <Link href="/auth" className="hidden md:block px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors text-base">
        Log In
      </Link>
      
      <button 
        className="md:hidden p-2 text-gray-600 hover:text-emerald-600 z-[60]"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Toggle navigation"
      >
        {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`fixed top-0 left-0 h-full w-full bg-white transition-transform duration-300 ease-in-out z-50 md:hidden ${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="pt-20 px-8 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="text-2xl font-bold py-2 border-b border-gray-200 hover:text-emerald-600"
              onClick={() => setMobileNavOpen(false)}
            >
              {link.text}
            </a>
          ))}
          <Link href="/auth" className="mt-6 px-5 py-3 text-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition-colors text-xl">
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
};
