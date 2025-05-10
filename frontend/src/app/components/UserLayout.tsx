'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from './sidebar/UserSidebar';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-medium text-teal-700 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <UserSidebar />
      
      <main className="flex-grow md:ml-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-teal-800 mb-2 sm:mb-0">Arbre Généalogique</h1>
            <div className="flex items-center px-3 py-1.5 bg-teal-50 rounded-full text-sm text-teal-700">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bienvenue, <span className="font-semibold ml-1">{user?.username}</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
