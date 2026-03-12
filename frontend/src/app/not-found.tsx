'use client';

import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}