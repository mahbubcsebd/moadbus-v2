import { logout } from '@/api/endpoints';
import { usePopup } from '@/context/PopupContext';
import { useAccountsStore } from '@/store/accountsStore';
import useBrandStore from '@/store/brandStore';
import useChatbotStore from '@/store/chatbotStore';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, LogOut, Mail, Sparkles, TextAlignStart, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Logo from '../global/Logo';
import NotificationDropdown from './NotificationDropdown';

export default function Header({ isCollapsed, setIsCollapsed, onMobileMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name || 'User';
  const { toggleChatbot } = useChatbotStore();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const { showConfirmPopup } = usePopup();
  // const router = useRouter();
  const userName = useAccountsStore((s) => s.userName);

  const notifications = [
    {
      id: 1,
      title: 'New transaction',
      description: 'Transfer of $1,000 completed',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Account statement ready',
      description: 'Your monthly statement is available',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Security alert',
      description: 'New device logged in',
      time: '1 day ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogoutRequest = () => {
    showConfirmPopup({
      title: 'Confirm Logout',
      description: 'Are you sure you want to log out?',
      confirmLabel: 'Yes, Logout',
      cancelLabel: 'Cancel',
      onConfirm: handleLogout,
    });
  };
  // handle logout
  const handleLogout = async () => {
    try {
      await logout({});
      useAccountsStore.getState().logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 md:px-6">
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuClick}
        className="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-100"
      >
        <TextAlignStart className="w-5 h-5 text-gray-700" />
      </button>
      <div className="" />
      <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
        <div className="overflow-hidden w-[100px] py-2">
          <Logo src={brandConfig.logo} alt={brandConfig.name} />
        </div>
      </Link>
      <div className="flex items-center gap-2 md:gap-3">
        <motion.button
          onClick={toggleChatbot}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 transition-all rounded-lg hover:bg-primary/5 group"
          title="AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-gray-700 transition-colors group-hover:text-primary" />
        </motion.button>

        <NotificationDropdown />

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-8 h-8 overflow-hidden transition-all rounded-full md:w-9 md:h-9 bg-primary ring-2 ring-white hover:ring-primary/20"
          >
            <div className="flex items-center justify-center w-full h-full text-sm font-semibold text-primary-foreground">
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl"
                >
                  {/* Profile Info */}
                  <div className="px-4 py-4 border-b border-gray-100 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 font-bold rounded-full bg-primary text-primary-foreground">
                        {userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-600">Premium Account</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link to="/dashboard/profile" onClick={() => setShowProfile(false)}>
                      <motion.button
                        whileHover={{
                          x: 4,
                          backgroundColor: 'rgb(249, 250, 251)',
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </motion.button>
                    </Link>

                    <Link to="/dashboard/security-password" onClick={() => setShowProfile(false)}>
                      <motion.button
                        whileHover={{
                          x: 4,
                          backgroundColor: 'rgb(249, 250, 251)',
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Change Password</span>
                      </motion.button>
                    </Link>

                    <Link to="/dashboard/security-history" onClick={() => setShowProfile(false)}>
                      <motion.button
                        whileHover={{
                          x: 4,
                          backgroundColor: 'rgb(249, 250, 251)',
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Session History</span>
                      </motion.button>
                    </Link>
                  </div>

                  <div className="py-2 border-t border-gray-100">
                    <motion.button
                      whileHover={{
                        x: 4,
                        backgroundColor: 'rgb(254, 242, 242)',
                      }}
                      onClick={handleLogoutRequest}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
