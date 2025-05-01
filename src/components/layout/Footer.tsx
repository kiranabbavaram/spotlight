import { Link } from 'react-router-dom';
import { Sparkles, GitHub, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-accent-600" />
              <span className="ml-2 text-lg font-bold text-slate-900">Spotlight</span>
            </div>
            <p className="mt-4 text-sm text-slate-600 max-w-md">
              Showcase your work with beautifully designed, customizable portfolio templates. 
              Share your projects with the world and stand out from the crowd.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">
                <GitHub className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-sm text-slate-600 hover:text-slate-900">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/sign-in" className="text-sm text-slate-600 hover:text-slate-900">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-600 hover:text-slate-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Spotlight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;