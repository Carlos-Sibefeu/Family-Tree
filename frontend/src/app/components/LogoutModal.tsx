'use client';

import { useEffect, useRef } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Ferme le modal si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Empêcher le défilement du body quand le modal est ouvert
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restaurer le défilement quand le modal est fermé
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-red-600 dark:text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
            Confirmation de déconnexion
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
