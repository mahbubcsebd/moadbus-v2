// src/components//MobileQuickActions.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { LockIcon, Mail, MapPin, Plus, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

const QUICK_ACTIONS = [
  // {
  //   id: 'corporate',
  //   label: 'Corporate Access',
  //   icon: Building2,
  //   route: '/reg-corporate-banking',
  //   mobileOnly: true,
  // },
  {
    id: 'personal',
    label: 'New to Mobile bankcing',
    icon: User,
    route: '/personal-registration',
    mobileOnly: true,
  },
  {
    id: 'forgot_pass',
    label: 'Forgot Password',
    icon: LockIcon,
    route: '/forgot-password',
    mobileOnly: true,
  },
  // {
  //   id: 'new_customer',
  //   label: 'Become a Client',
  //   icon: UserPlus,
  //   route: '/new-customer',
  //   mobileOnly: true,
  // },
  // {
  //   id: 'open_account',
  //   label: 'Open New Account',
  //   icon: CreditCard,
  //   route: '/open-account',
  //   mobileOnly: true,
  // },
  // Added extra items based on the reference image pop-up for better UX
  {
    id: 'locate',
    label: 'Find Branch/ATM',
    icon: MapPin,
    route: '/find-branch',
    mobileOnly: false,
  },
  {
    id: 'contact',
    label: 'Contact Us',
    icon: Mail,
    route: '/contact-us',
    mobileOnly: false,
  },
];

const MobileQuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Floating Action Button (FAB) */}
      <motion.button
        className="fixed z-40 flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full shadow-xl bottom-6 right-6 shadow-primary/50/50"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label="Quick Actions"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Pop-up Menu (Dialog/Sheet Simulation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-6 bg-white shadow-2xl rounded-t-2xl"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h4 className="text-lg font-bold text-gray-800">Quick Access</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Using a grid to display action items on mobile */}
            <div className="grid grid-cols-2 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.id}
                  to={action.route}
                  className="flex flex-col items-center justify-center p-4 space-y-2 text-center transition-colors duration-200 border border-gray-100 bg-gray-50 rounded-xl hover:bg-primary/5 group"
                  onClick={() => setIsOpen(false)} // Close on click
                >
                  <action.icon className="w-6 h-6 text-primary group-hover:text-primary" />
                  <span className="text-xs font-medium text-gray-700 group-hover:text-gray-800">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 mb-3 text-xs text-gray-500">
              <Link to="/privacy-notice" className="transition-colors hover:text-primary">
                Privacy Notice
              </Link>
              <span>|</span>
              <Link to="/faq" className="transition-colors hover:text-primary">
                FAQ
              </Link>
              <span>|</span>
              <Link to="/technical-requirements" className="transition-colors hover:text-primary">
                Technical Requirements
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileQuickActions;
