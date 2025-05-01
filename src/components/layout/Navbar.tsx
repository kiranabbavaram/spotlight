import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Menu, X, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Sparkles className="h-8 w-8 text-accent-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">Spotlight</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300">
                Home
              </Link>
              {isSignedIn && (
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard/profile" className="text-slate-600 hover:text-slate-900">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/sign-in" className="text-slate-600 hover:text-slate-900">
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-primary-600 px-3 py-2 rounded-md text-sm text-white hover:bg-primary-700"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block pl-3 pr-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isSignedIn && (
                <Link 
                  to="/dashboard" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isSignedIn ? (
                <>
                  <Link 
                    to="/dashboard/profile" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/sign-in" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;