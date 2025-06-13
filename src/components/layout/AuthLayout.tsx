import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiUsers,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { GiNinjaArmor } from "react-icons/gi";

const navLinks = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: <FiHome />,
  },
  {
    name: "Accounts",
    to: "/accounts",
    icon: <FiUsers />,
    submenu: [
      { name: "Manage Accounts", to: "/accounts" },
      { name: "Add Account", to: "/accounts/new" },
    ],
  },
  {
    name: "Characters",
    to: "/characters",
    icon: <FiUser />,
    submenu: [
      { name: "Character List", to: "/characters" },
      { name: "View Character Inventory", to: "/characters/inventory" },
    ],
  },
  {
    name: "Items",
    to: "/items",
    icon: <GiNinjaArmor />,
    submenu: [
      { name: "Player Items", to: "/items" },
      { name: "Trade Logs", to: "/trade-logs" },
    ],
  },
];

const AuthLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [submenuPosition, setSubmenuPosition] = useState<
    Record<string, "left" | "right">
  >({}); // Track submenu position per menu item

  const submenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const location = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenDesktopDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleDesktopDropdown = (name: string) => {
    if (openDesktopDropdown === name) {
      setOpenDesktopDropdown(null);
      return;
    }
    setOpenDesktopDropdown(name);
  };

  // Effect to check submenu positioning when openDesktopDropdown changes
  useEffect(() => {
    if (openDesktopDropdown) {
      const submenuEl = submenuRefs.current[openDesktopDropdown];
      if (submenuEl) {
        const rect = submenuEl.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          // If submenu overflows right edge, align right
          setSubmenuPosition((prev) => ({
            ...prev,
            [openDesktopDropdown]: "right",
          }));
        } else {
          // Otherwise align left
          setSubmenuPosition((prev) => ({
            ...prev,
            [openDesktopDropdown]: "left",
          }));
        }
      }
    }
  }, [openDesktopDropdown]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-brand text-white px-4 py-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">FlyFF Admin</h1>

        {/* Desktop nav */}
        <nav className="space-x-6 hidden sm:flex items-center relative">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                onClick={() =>
                  link.submenu ? toggleDesktopDropdown(link.name) : closeMenu()
                }
                className={`inline-flex items-center gap-1 hover:underline focus:outline-none ${
                  location.pathname.startsWith(link.to)
                    ? "font-semibold underline"
                    : ""
                }`}
              >
                {link.icon}
                {link.name}
                {link.submenu && <FiChevronDown size={14} />}
              </button>

              {link.submenu && openDesktopDropdown === link.name && (
                <div
                  ref={(el) => {
                    submenuRefs.current[link.name] = el;
                  }}
                  className={`absolute top-full mt-2 bg-white text-black shadow-md rounded-md z-50 min-w-max ${
                    submenuPosition[link.name] === "right"
                      ? "right-0 left-auto"
                      : "left-0 right-auto"
                  }`}
                >
                  {link.submenu.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm hover:bg-surface"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile nav menu (animated) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden bg-brand text-white flex flex-col px-4 py-3 gap-1"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                <button
                  onClick={() =>
                    link.submenu ? toggleDropdown(link.name) : closeMenu()
                  }
                  className="flex items-center justify-between text-left text-sm py-2"
                >
                  <span className="flex items-center gap-2">
                    {link.icon} {link.name}
                  </span>
                  {link.submenu && <FiChevronDown size={14} />}
                </button>

                {/* Submenu for mobile */}
                {link.submenu && openDropdown === link.name && (
                  <div className="pl-4 flex flex-col">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={closeMenu}
                        className="text-sm py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* No submenu link */}
                {!link.submenu && (
                  <Link
                    to={link.to}
                    onClick={closeMenu}
                    className="pl-2 text-sm"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-center text-sm py-2 text-black font-medium">
        © {new Date().getFullYear()} FlyFF Admin Panel. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
