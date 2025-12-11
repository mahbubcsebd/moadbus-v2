import { useState } from 'react';
import { Link, Outlet } from 'react-router';
import AIChatbot from '../global/AIChatbot';
import TransferSuccess from '../global/TransferSuccess';
import Header from './Header';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-60'}
        `}
      >
        <Header
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 pb-24 md:pb-6 max-w-[1600px] mx-auto overflow-y-hidden">
          <Outlet />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 mb-3 text-xs text-gray-500 lg:mt-10">
            <Link
              to="/privacy-notice"
              className="text-sm text-blue-600 transition-colors hover:text-blue-600 hover:underline"
            >
              Privacy Notice
            </Link>
            <span>|</span>
            <Link
              to="/faq"
              className="text-sm text-blue-600 transition-colors hover:text-blue-600 hover:underline"
            >
              FAQ
            </Link>
            <span>|</span>
            <Link
              to="/technical-requirements"
              className="text-sm text-blue-600 transition-colors hover:text-blue-600 hover:underline"
            >
              Technical Requirements
            </Link>
          </div>
        </main>
      </div>
      <MobileNav onMenuClick={() => setMobileSidebarOpen(true)} />
      <AIChatbot />
      <TransferSuccess />
    </div>
  );
}
