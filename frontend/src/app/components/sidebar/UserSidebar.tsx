'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';
import LogoutModal from '../LogoutModal';

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    // Si le chemin est exactement le même, c'est actif
    if (pathname === path) return true;
    
    // Si le chemin actuel commence par le chemin du lien + '/', c'est actif
    if (pathname?.startsWith(path + '/')) return true;
    
    // Cas spéciaux pour certaines sections
    switch (path) {
      case '/dashboard':
        // Le tableau de bord est actif uniquement sur sa propre page
        return pathname === '/dashboard';
        
      case '/family-tree':
        // Toutes les pages commençant par /family-tree sont dans la section arbre généalogique
        // Mais pas /family-tree/analysis qui a son propre lien
        if (pathname === '/family-tree/analysis') return false;
        return pathname?.startsWith('/family-tree');
        
      case '/family-tree/analysis':
        // Section analyse spécifique
        return pathname === '/family-tree/analysis';
        
      case '/search':
        // Toutes les pages de recherche
        return pathname?.startsWith('/search');
        
      case '/algorithms':
        // Toutes les pages d'algorithmes
        return pathname?.startsWith('/algorithms');
        
      case '/profile':
        // Toutes les pages de profil
        return pathname?.startsWith('/profile');
        
      default:
        // Par défaut, vérifie si le chemin commence par le chemin du lien
        return pathname?.startsWith(path);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    AuthService.logout();
    router.push('/login');
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
          <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">Arbre Généalogique</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-slate-300 rounded-full mb-8 opacity-80"></div>
          
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/dashboard') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Tableau de bord
            </Link>
            
            <Link
              href="/family-tree"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/family-tree') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Arbre généalogique
            </Link>
            
            <Link
              href="/family-tree/analysis"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/family-tree/analysis') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyse
            </Link>
            
            <Link
              href="/search"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/search') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Recherche
            </Link>
            
            <Link
              href="/algorithms"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/algorithms') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l6-6" />
              </svg>
              Algorithmes
            </Link>
            
            <Link
              href="/profile"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/profile') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-teal-700/20">
          <button
            onClick={handleLogoutClick}
            className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-slate-600/30 transition-all duration-300 text-left group"
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
        onClose={handleCancelLogout} 
        onConfirm={handleConfirmLogout} 
      />
    </>
  );
}
