import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h2>
      <p className="mt-2 text-slate-600">Sorry, we couldn't find the page you're looking for.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
      >
        <Home className="h-4 w-4 mr-2" />
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;