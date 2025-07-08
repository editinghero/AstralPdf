import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import GlassMorphism from "./GlassMorphism";

const navLinks = [
  { name: "Compress", href: "/compress" },
  { name: "Merge", href: "/merge" },
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
  const isActive = location.pathname === to;
  return (
    <NavLink to={to} className="relative text-white/80 hover:text-white transition-colors duration-200">
      {children}
      {isActive && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />}
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
      <GlassMorphism as="header" className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl font-bold text-shadow">
              <span className="gradient-text">Astral</span>
              <span className="text-white ml-1">PDF</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => <NavItem key={link.name} to={link.href}>{link.name}</NavItem>)}
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setIsImagesDropdownOpen(prev => !prev)} className="relative flex items-center gap-1 text-white/80 hover:text-white transition-colors duration-200">
                  Images <ChevronDownIcon className={`w-4 h-4 transition-transform ${isImagesDropdownOpen ? 'rotate-180' : ''}`} />
                  {isImagesActive && !isImagesDropdownOpen && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />}
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
                        <NavLink key={link.name} to={link.href} className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">
                          {link.name}
                        </NavLink>
                      ))}
                    </GlassMorphism>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <XMarkIcon className="h-8 w-8 text-white" /> : <Bars3Icon className="h-8 w-8 text-white" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <GlassMorphism
              className="md:hidden absolute top-20 left-0 w-full bg-black/30 backdrop-blur-3xl border-t border-white/5 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col items-center gap-4 py-6">
                {navLinks.map((link) => <NavLink key={link.name} to={link.href} className="text-lg text-white/80 hover:text-white">{link.name}</NavLink>)}
                <div className="w-full text-center">
                  <button onClick={() => setIsMobileImagesOpen(!isMobileImagesOpen)} className="flex items-center justify-center gap-2 w-full text-lg text-white/80 hover:text-white">
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
                          <NavLink key={link.name} to={link.href} className="block text-base py-2 text-white/70 hover:text-white">{link.name}</NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassMorphism>
          )}
        </AnimatePresence>
      </GlassMorphism>
      {isMenuOpen && <div className="fixed inset-0 z-40 bg-black/10 md:hidden" onClick={() => setIsMenuOpen(false)} />}
    </>
  );
} 