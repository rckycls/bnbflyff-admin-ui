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
import { MdOutlineAdminPanelSettings } from "react-icons/md";

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
  {
    name: "GM",
    to: "/gamemasters",
    icon: <MdOutlineAdminPanelSettings />,
    submenu: [
      { name: "Manage Game Masters", to: "/gamemasters" },
      { name: "Create New GM", to: "/gamemasters/new" },
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
  >({});

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
    setOpenDesktopDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    if (openDesktopDropdown) {
      const submenuEl = submenuRefs.current[openDesktopDropdown];
      if (submenuEl) {
        const rect = submenuEl.getBoundingClientRect();
        const availableWidth = window.innerWidth - rect.left;
        if (availableWidth < rect.width + 32) {
          setSubmenuPosition((prev) => ({
            ...prev,
            [openDesktopDropdown]: "right",
          }));
        } else {
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
      <header className="sticky top-0 z-50 bg-brand text-white px-4 py-3 shadow-md flex justify-between items-center">
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
              <AnimatePresence>
                {link.submenu && openDesktopDropdown === link.name && (
                  <motion.div
                    ref={(el) => {
                      submenuRefs.current[link.name] = el;
                    }}
                    key="submenu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`
        absolute top-full mt-2 z-50
        bg-white text-black shadow-md rounded-md
        min-w-[12rem] max-w-[calc(100vw-2rem)]
        overflow-x-auto whitespace-nowrap
        ${submenuPosition[link.name] === "right" ? "right-0" : "left-0"}
      `}
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
                  </motion.div>
                )}
              </AnimatePresence>
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
            className="sm:hidden sticky top-[2.75rem] z-40 bg-brand/80 text-white flex flex-col px-4 py-3 gap-1"
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

                <AnimatePresence>
                  {link.submenu && openDropdown === link.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 flex flex-col overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

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
