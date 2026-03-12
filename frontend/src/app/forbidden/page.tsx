'use client';

import { useRouter } from 'next/navigation';
import { HiOutlineShieldExclamation } from 'react-icons/hi';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HiOutlineShieldExclamation className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Access Denied</h2>
        <p className="text-gray-500 mb-8">
          You don't have the required permission to access this page.
          Contact your administrator or manager to request access.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}