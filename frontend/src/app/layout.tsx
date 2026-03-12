import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RBAC System — Dynamic Permissions',
  description: 'Role-Based Access Control with dynamic permission management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E1E2D',
              color: '#fff',
              borderRadius: '10px',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}