'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';
import LogoutModal from '../LogoutModal';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    // Si le chemin est exactement le même, c'est actif
    if (pathname === path) return true;
    
    // Si le chemin actuel commence par le chemin du lien + '/', c'est actif
    if (pathname?.startsWith(path + '/')) return true;
    
    // Cas spéciaux pour certaines sections admin
    switch (path) {
      case '/admin/dashboard':
        // Le tableau de bord admin est actif uniquement sur sa propre page
        return pathname === '/admin/dashboard';
        
      case '/admin/users':
        // Toutes les pages de gestion des utilisateurs
        return pathname?.startsWith('/admin/users');
        
      case '/admin/family-tree':
        // Toutes les pages de gestion de l'arbre généalogique
        return pathname?.startsWith('/admin/family-tree');
        
      case '/admin/requests':
        // Toutes les pages de demandes d'adhésion
        return pathname?.startsWith('/admin/requests');
        
      case '/admin/settings':
        // Toutes les pages de paramètres
        return pathname?.startsWith('/admin/settings');
        
      default:
        // Par défaut, vérifie si le chemin commence par le chemin du lien
        return pathname?.startsWith(path);
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-teal-700 text-white p-2 rounded-lg shadow-lg hover:bg-teal-800 transition-all duration-300"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-teal-800 to-slate-800 text-white w-64 shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">Admin Panel</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-slate-300 rounded-full mb-8 opacity-80"></div>
          
          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive('/admin/dashboard') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Tableau de bord
            </Link>
            
            <Link
              href="/admin/membership-requests"
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive('/admin/membership-requests') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Demandes d'adhésion
            </Link>
            
            <Link
              href="/admin/users"
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive('/admin/users') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Utilisateurs
            </Link>
            
            <Link
              href="/admin/family-tree"
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive('/admin/family-tree') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l6-6" />
              </svg>
              Arbre généalogique
            </Link>
            
            <Link
              href="/admin/settings"
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive('/admin/settings') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-teal-700/20">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-600/30 transition-all duration-300 text-left group"
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
            </svg>
            Quitter l'admin
          </Link>
          
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-slate-600/30 transition-all duration-300 text-left group mt-2"
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
      {/* Modal de déconnexion */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={() => {
          AuthService.logout();
          router.push('/login');
          setShowLogoutModal(false);
        }} 
      />
    </>
  );
}
