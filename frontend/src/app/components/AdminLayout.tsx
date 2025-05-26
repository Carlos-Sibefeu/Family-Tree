'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './sidebar/AdminSidebar';
// panel admin
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et a le rôle d'administrateur
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      
      // Vérifier si l'utilisateur a le rôle d'administrateur
      if (!userData.roles || !userData.roles.includes('ROLE_ADMIN')) {
        // Rediriger vers le tableau de bord utilisateur si l'utilisateur n'est pas administrateur
        router.push('/dashboard');
        return;
      }
      
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-grow md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Administration</h1>
            <div className="text-sm text-gray-600">
              Connecté en tant que <span className="font-semibold">{user?.username}</span>
            </div>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
