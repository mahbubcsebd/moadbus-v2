import { motion } from 'framer-motion';
import { ArrowLeftRight, LayoutDashboard, MoreHorizontal, Send, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  {
    id: 'transfers',
    label: 'Transfer',
    icon: ArrowLeftRight,
    route: 'transfers',
  },
  {
    id: 'bill-payments',
    label: 'Bill Pay',
    icon: Send,
    route: 'bill-payments',
  },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'mobile-topup', label: 'Top-Up', icon: Upload, route: 'mobile-topup' },
  { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
];

export default function MobileNav({ onMenuClick }) {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl md:hidden z-999 shadow-gray-300/50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ id, label, icon: Icon, route }) => {
          const isActive = pathname === route;

          if (id === 'more') {
            return (
              <button
                key={id}
                onClick={onMenuClick}
                className="flex flex-col items-center gap-1 py-2 px-3 min-w-[60px]"
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={id}
              to={route}
              className="flex flex-col items-center gap-1 py-2 px-3 relative min-w-[60px]"
            >
              {id === 'dashboard' ? (
                <div className="flex flex-col items-center -mt-8">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-linear-to-br from-primary/50 to-primary shadow-orange-300'
                        : 'bg-linear-to-br from-gray-700 to-gray-800 shadow-gray-400'
                    }`}
                  >
                    <Icon className="text-white w-7 h-7" />
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Active Indicator - Only for non-dashboard items */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute top-0 w-1 h-1 -translate-x-1/2 bg-primary rounded-full left-1/2"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
