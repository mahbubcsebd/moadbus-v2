import { sidebarMenuItems } from '@/data/mockData';
import useBrandStore from '@/store/brandStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  File,
  FileText,
  Headphones,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  PanelLeft,
  PanelRight,
  Send,
  Smartphone,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Logo from '../global/Logo';

const iconMap = {
  pieChart: LayoutDashboard,
  building: Building2,
  document: FileText,
  documentText: File,
  transfer: ArrowLeftRight,
  send: Send,
  users: Users,
  mobile: Smartphone,
  support: Headphones,
  message: MessageSquare,
  location: MapPin,
  calendar: Calendar,
  upload: Upload,
  mail: Mail,
  user: User,
  lock: Lock,
  notification: Bell,
  palette: Palette,
};

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen = false,
  setMobileOpen = () => {},
}) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const activeItem = segments[1] || segments[0] || 'dashboard';
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (itemId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const hoverMotion = {
    rest: { x: 0, backgroundColor: 'rgba(255,255,255,0)' },
    hover: {
      x: 4,
      backgroundColor: 'rgb(var(--color-primary) / 0.05)',
      transition: { duration: 0.3 },
    },
  };

  const submenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  // Check if submenu item is active
  const isSubmenuActive = (submenuId) => {
    return activeItem === submenuId;
  };

  // Check if parent menu should be active (if any submenu is active)
  const isParentActive = (item) => {
    if (activeItem === item.id) return true;
    if (item.submenu) {
      return item.submenu.some((sub) => activeItem === sub.id);
    }
    return false;
  };

  const renderMenuItem = (item, isMobile = false) => {
    const Icon = iconMap[item.icon];
    const isActive = isParentActive(item);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.id];

    return (
      <div key={item.id}>
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={hoverMotion}
          className="rounded-md"
        >
          {hasSubmenu ? (
            <button
              onClick={() => toggleSubmenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 relative transition-all duration-300 rounded-md ${
                isActive
                  ? 'text-primary bg-primary/5 shadow-sm'
                  : 'text-gray-700 hover:text-primary'
              } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? 'mobileActive' : 'activeIndicator'}
                  className="absolute top-0 bottom-0 left-0 w-1 bg-primary"
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="flex-1 text-sm font-medium text-left whitespace-nowrap">
                    {item.label}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </button>
          ) : (
            <Link
              to={item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 relative transition-all duration-300 rounded-md ${
                isActive
                  ? 'text-primary bg-primary/5 shadow-sm'
                  : 'text-gray-700 hover:text-primary'
              } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? 'mobileActive' : 'activeIndicator'}
                  className="absolute top-0 bottom-0 left-0 w-1 bg-primary"
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </>
              )}
            </Link>
          )}
        </motion.div>

        {/* Submenu */}
        {hasSubmenu && (!isCollapsed || isMobile) && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={submenuVariants}
                className="overflow-hidden"
              >
                <div className="py-1 space-y-1">
                  {item.submenu.map((subItem) => {
                    const isSubActive = isSubmenuActive(subItem.id);
                    return (
                      <Link
                        key={subItem.id}
                        to={`/dashboard/${subItem.id}`}
                        onClick={() => isMobile && setMobileOpen(false)}
                        className={`flex items-start gap-3 px-4 py-2.5 pl-5 text-sm transition-all duration-200 rounded-md ${
                          isSubActive
                            ? 'text-primary bg-primary/5 font-medium'
                            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <span className="flex-1 leading-snug">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 md:hidden bg-black/50 z-80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 flex flex-col h-screen overflow-hidden bg-white border-r border-gray-200 md:hidden z-90 w-60"
          >
            {/* Logo */}
            <div className="flex items-center justify-between pl-1 pr-2 border-b border-gray-200">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="overflow-hidden w-[120px] py-2">
                  <Logo src={brandConfig.logo} alt={brandConfig.name} />
                </div>
              </Link>

              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-4 overflow-x-hidden overflow-y-auto custom-scrollbar">
              {sidebarMenuItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <div className="px-4 mb-2">
                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      {section.section}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {section.items.map((item) => renderMenuItem(item, true))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
              {brandConfig.copyright}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Expand Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="hidden md:block fixed left-[65px] top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all z-50"
        >
          <PanelRight className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 z-40 flex-col hidden h-screen overflow-hidden bg-white border-r border-gray-200 md:flex"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 pr-4 border-b border-gray-200">
          {!isCollapsed ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="overflow-hidden w-[120px] py-2">
                <Logo src={brandConfig.logo} alt={brandConfig.name} />
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="inline-block w-8 h-8 overflow-hidden rounded-full">
              {/* <img src="" alt="logo" className="w-full h-full overflow-hidden rounded-full" /> */}
            </Link>
          )}

          {!isCollapsed && (
            <button onClick={() => setIsCollapsed(true)} className="p-1 rounded hover:bg-gray-100">
              <PanelLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-x-hidden overflow-y-auto custom-scrollbar">
          {sidebarMenuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    {section.section}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => renderMenuItem(item, false))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
          {!isCollapsed ? brandConfig.copyright : '©'}
        </div>
      </motion.aside>
    </>
  );
}
