'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Si le chemin est exactement le même, c'est actif
    if (pathname === path) return true;
    
    // Si le chemin actuel commence par le chemin du lien + '/', c'est actif
    if (pathname?.startsWith(path + '/')) return true;
    
    // Cas spéciaux pour certaines sections publiques
    switch (path) {
      case '/':
        // La page d'accueil est active uniquement sur sa propre page
        return pathname === '/';
        
      case '/about':
        // Toutes les pages à propos
        return pathname?.startsWith('/about');
        
      case '/membership':
        // Toutes les pages d'adhésion
        return pathname?.startsWith('/membership');
        
      case '/login':
        // Page de connexion
        return pathname === '/login';
        
      case '/register':
        // Page d'inscription
        return pathname === '/register';
        
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
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-teal-800 to-slate-800 text-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Arbre Généalogique</h1>
          
          <nav className="space-y-4">
            <Link
              href="/"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/about') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              À propos
            </Link>
            <Link
              href="/membership/apply"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/membership/apply') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              Demande d'adhésion
            </Link>
            <Link
              href="/login"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/login') ? 'bg-teal-700/30 shadow-md backdrop-blur-sm' : 'hover:bg-teal-700/20 hover:translate-x-1'
              }`}
            >
              Connexion
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-sm text-teal-300">
            © {new Date().getFullYear()} Arbre Généalogique
            <br />
            Projet de Recherche Opérationnelle
          </div>
        </div>
      </div>
    </>
  );
}
