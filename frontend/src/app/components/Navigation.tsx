'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '../services/auth.service';
import LogoutModal from './LogoutModal';

interface NavigationProps {
  user: any;
}

export default function Navigation({ user }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <>
    <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            Arbre Généalogique
          </Link>

          {/* Menu pour mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
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

          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className={`hover:underline ${isActive('/dashboard') ? 'font-bold' : ''}`}
            >
              Tableau de bord
            </Link>
            <Link 
              href="/family-tree" 
              className={`hover:underline ${isActive('/family-tree') ? 'font-bold' : ''}`}
            >
              Arbre généalogique
            </Link>
            <Link 
              href="/search" 
              className={`hover:underline ${isActive('/search') ? 'font-bold' : ''}`}
            >
              Recherche
            </Link>
            <Link 
              href="/profile" 
              className={`hover:underline ${isActive('/profile') ? 'font-bold' : ''}`}
            >
              Profil
            </Link>
            <span>|</span>
            <span>Bonjour, {user?.username}</span>
            <button 
              onClick={handleLogoutClick}
              className="bg-white/90 text-teal-700 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Menu mobile déplié */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link 
              href="/dashboard" 
              className={`block py-2 hover:bg-teal-700/30 rounded-lg px-3 ${isActive('/dashboard') ? 'bg-teal-700/40 shadow-sm' : ''}`}
            >
              Tableau de bord
            </Link>
            <Link 
              href="/family-tree" 
              className={`block py-2 hover:bg-teal-700/30 rounded-lg px-3 ${isActive('/family-tree') ? 'bg-teal-700/40 shadow-sm' : ''}`}
            >
              Arbre généalogique
            </Link>
            <Link 
              href="/search" 
              className={`block py-2 hover:bg-teal-700/30 rounded-lg px-3 ${isActive('/search') ? 'bg-teal-700/40 shadow-sm' : ''}`}
            >
              Recherche
            </Link>
            <Link 
              href="/profile" 
              className={`block py-2 hover:bg-teal-700/30 rounded-lg px-3 ${isActive('/profile') ? 'bg-teal-700/40 shadow-sm' : ''}`}
            >
              Profil
            </Link>
            <div className="pt-2 border-t border-teal-600/30">
              <span>Bonjour, {user?.username}</span>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="w-full text-left bg-white/90 text-teal-700 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 font-medium"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
    <LogoutModal 
      isOpen={showLogoutModal} 
      onClose={handleCancelLogout} 
      onConfirm={handleConfirmLogout} 
    />
    </>
  );
}
