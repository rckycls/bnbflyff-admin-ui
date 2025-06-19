import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import iconAccount from '../../assets/icon_account.png';
import iconCharacter from '../../assets/icon_character.png';
import iconGuild from '../../assets/icon_guild.png';
import iconInventory from '../../assets/icon_inventory.png';
import iconGM from '../../assets/icon_gm.png';
import { useTheme, type ThemeType } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

const themeOptions = [
  { value: 'light', icon: <FiSun size={14} /> },
  { value: 'dark', icon: <FiMoon size={14} /> },
  { value: 'classic', icon: <MdAutoAwesome size={14} /> },
];

const navLinks = [
  // {
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <FiHome />,
  // },
  {
    name: 'Accounts',
    to: '/accounts',
    icon: <img src={iconAccount} className="w-5 h-5" />,
    submenu: [
      { name: 'Manage Accounts', to: '/accounts' },
      { name: 'Add Account', to: '/accounts/new' },
    ],
  },
  {
    name: 'Characters',
    to: '/characters',
    icon: <img src={iconCharacter} className="w-5 h-5" />,
    submenu: [
      { name: 'Character List', to: '/characters' },
      { name: 'View Character Inventory', to: '/characters/inventory' },
    ],
  },
  {
    name: 'Guilds',
    to: '/guilds',
    icon: <img src={iconGuild} className="w-5 h-5" />,
    submenu: [{ name: 'Guild List', to: '/guilds' }],
  },
  {
    name: 'Items',
    to: '/items',
    icon: <img src={iconInventory} className="w-5 h-5" />,
    submenu: [
      { name: 'Player Items', to: '/items' },
      { name: 'Trade Logs', to: '/trade-logs' },
    ],
  },
  {
    name: 'GM',
    to: '/gamemasters',
    icon: <img src={iconGM} className="w-5 h-5" />,
    submenu: [
      { name: 'Manage Game Masters', to: '/gamemasters' },
      { name: 'Create New GM', to: '/gamemasters/new' },
    ],
  },
];

const AuthLayout = () => {
  const { theme, setTheme } = useTheme();
  const themeIndex = themeOptions.findIndex((t) => t.value === theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [submenuPosition, setSubmenuPosition] = useState<
    Record<string, 'left' | 'right'>
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
            [openDesktopDropdown]: 'right',
          }));
        } else {
          setSubmenuPosition((prev) => ({
            ...prev,
            [openDesktopDropdown]: 'left',
          }));
        }
      }
    }
  }, [openDesktopDropdown]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-50 bg-brand text-white px-4 py-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">FlyFF Admin</h1>

        <nav className="space-x-6 hidden sm:flex items-center relative">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                onClick={() =>
                  link.submenu ? toggleDesktopDropdown(link.name) : closeMenu()
                }
                className={`inline-flex items-center gap-1 hover:underline focus:outline-none ${
                  location.pathname.startsWith(link.to)
                    ? 'font-semibold underline'
                    : ''
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
        ${submenuPosition[link.name] === 'right' ? 'right-0' : 'left-0'}
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

        <div className="relative w-[100px] h-8 bg-surface border border-muted rounded-full flex items-center justify-between px-1 shadow-md overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-8 w-[33.33%] rounded-full bg-brand z-0"
            animate={{ x: `${themeIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />

          {themeOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value as ThemeType)}
              className={`z-10 w-[33.33%] h-full flex items-center justify-center rounded-full transition-colors duration-200 ${
                theme === t.value ? 'text-white' : 'text-muted'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
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
                      animate={{ height: 'auto', opacity: 1 }}
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
