'use client';

import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="my-6 text-3xl font-bold text-gray-900">
            404 - Page Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center p-2 bg-gradient-to-r from-blue-300 to-sky-300 text-white rounded-md font-semibold transition-all duration-200 hover:from-blue-400 hover:to-sky-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
