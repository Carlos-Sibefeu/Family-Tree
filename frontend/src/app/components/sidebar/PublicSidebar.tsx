'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-2 rounded-md shadow-md"
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
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Arbre Généalogique</h1>
          
          <nav className="space-y-4">
            <Link
              href="/"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/about') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              À propos
            </Link>
            <Link
              href="/membership/apply"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/membership/apply') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Demande d'adhésion
            </Link>
            <Link
              href="/login"
              className={`block py-2 px-4 rounded transition-colors ${
                isActive('/login') ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Connexion
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-sm text-blue-300">
            © {new Date().getFullYear()} Arbre Généalogique
            <br />
            Projet de Recherche Opérationnelle
          </div>
        </div>
      </div>
    </>
  );
}
