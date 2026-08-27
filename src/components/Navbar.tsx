import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import GlassMorphism from "./GlassMorphism";

const navLinks = [
  { name: "Compress", href: "/compress" },
  { name: "Merge", href: "/merge" },
  { name: "Split", href: "/split" },
  { name: "Watermark", href: "/watermark" },
];

const imageToolsLinks = [
  { name: "PDF to Images", href: "/pdf-to-images" },
  { name: "Images to PDF", href: "/images-to-pdf" },
];

function useClickOutside(ref: React.RefObject<HTMLDivElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
        active
        ? "bg-[#f0788a] text-white font-bold shadow-[0_0_16px_rgba(240,120,138,0.35)]"
        : "text-[#dbc9b5] hover:text-[#fff3e0] hover:bg-[rgba(255,243,224,0.06)]"
      }`}
    >
      <span>{children}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImagesDropdownOpen, setIsImagesDropdownOpen] = useState(false);
  const [isMobileImagesOpen, setIsMobileImagesOpen] = useState(false);
  
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsImagesDropdownOpen(false));

  const isImagesActive = imageToolsLinks.some(l => l.href === location.pathname);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileImagesOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-50 px-3 sm:px-4 mb-4 sm:mb-8 pt-4">
        <nav
          className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-[rgba(255,243,224,0.07)] bg-[rgba(34,25,26,0.85)] px-3.5 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all sm:px-5 sm:py-2.5"
          aria-label="Main Navigation"
        >
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-shadow">
              <span className="gradient-text">Astral</span>
              <span className="text-[#fff3e0] ml-1">PDF</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => <NavItem key={link.name} to={link.href}>{link.name}</NavItem>)}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsImagesDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                  isImagesActive
                  ? "bg-[#f0788a] text-white font-bold shadow-[0_0_16px_rgba(240,120,138,0.35)]"
                  : "text-[#dbc9b5] hover:text-[#fff3e0] hover:bg-[rgba(255,243,224,0.06)]"
                }`}
              >
                Images <ChevronDownIcon className={`w-4 h-4 transition-transform ${isImagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isImagesDropdownOpen && (
                  <GlassMorphism
                    className="absolute top-full mt-3 w-48 rounded-lg py-2 z-20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {imageToolsLinks.map((link) => (
                      <NavLink key={link.name} to={link.href} className="block px-4 py-2 text-sm text-[#dbc9b5] hover:bg-white/5 hover:text-white">
                        {link.name}
                      </NavLink>
                    ))}
                  </GlassMorphism>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XMarkIcon className="h-8 w-8 text-[#f0788a]" /> : <Bars3Icon className="h-8 w-8 text-[#dbc9b5]" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <GlassMorphism
              className="md:hidden absolute top-20 left-0 w-full bg-[#191213]/90 backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-2xl border border-[rgba(255,243,224,0.07)]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col items-center gap-4 py-6">
                {navLinks.map((link) => <NavLink key={link.name} to={link.href} className="text-lg text-[#dbc9b5] hover:text-white">{link.name}</NavLink>)}
                <div className="w-full text-center">
                  <button onClick={() => setIsMobileImagesOpen(!isMobileImagesOpen)} className="flex items-center justify-center gap-2 w-full text-lg text-[#dbc9b5] hover:text-white">
                    Image Tools <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileImagesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileImagesOpen && (
                      <motion.div
                        className="mt-2 flex flex-col items-center gap-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {imageToolsLinks.map((link) => (
                          <NavLink key={link.name} to={link.href} className="block text-base py-2 text-[#dbc9b5] hover:text-white">{link.name}</NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassMorphism>
          )}
        </AnimatePresence>
      </header>
      {isMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)} />}
    </>
  );
} 