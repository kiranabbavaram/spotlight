import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  Palette, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Templates', href: '/dashboard/templates', icon: Palette },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow text-slate-700 hover:text-slate-900"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black lg:hidden z-40"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
          initial={false}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-accent-600" />
                <span className="ml-2 text-lg font-bold text-slate-900">Spotlight</span>
              </div>
              <button 
                onClick={closeSidebar}
                className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-50'
                        : 'flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-slate-500'}`} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="px-4 py-4 border-t border-slate-200">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <LogOut className="mr-3 h-5 w-5 text-slate-500" />
                Sign out
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;