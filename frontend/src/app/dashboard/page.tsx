'use client';

import Link from 'next/link';
import UserLayout from '../components/UserLayout';

export default function Dashboard() {

  return (
    <UserLayout>
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          <svg className="h-8 w-8 mr-3 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Tableau de bord
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte 1: Arbre généalogique */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-bold">Arbre généalogique</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Visualisez et explorez votre arbre généalogique familial.</p>
              <Link 
                href="/family-tree"
                className="block text-center bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Voir l'arbre
              </Link>
            </div>
          </div>
          
          {/* Carte 2: Recherche de parenté */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-bold">Recherche de parenté</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Découvrez les liens de parenté entre les membres de votre famille.</p>
              <Link 
                href="/search"
                className="block text-center bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Rechercher
              </Link>
            </div>
          </div>
          
          {/* Carte 3: Profil */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-slate-500 to-slate-600 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-xl font-bold">Profil utilisateur</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Gérez votre profil et vos préférences.</p>
              <Link 
                href="/profile"
                className="block text-center bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Mon profil
              </Link>
            </div>
          </div>
          
          {/* Carte 4: Ajouter un membre */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Ajouter un membre</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Ajoutez un nouveau membre à votre arbre généalogique.</p>
              <Link 
                href="/family-tree/add"
                className="block text-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Ajouter
              </Link>
            </div>
          </div>
          
          {/* Carte 5: Statistiques */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold">Statistiques</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Consultez les statistiques de votre arbre généalogique.</p>
              <Link 
                href="/family-tree/stats"
                className="block text-center bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Voir les stats
              </Link>
            </div>
          </div>
          
          {/* Carte 6: Algorithmes */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-teal-600 to-slate-600 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l6-6" />
              </svg>
              <h3 className="text-xl font-bold">Algorithmes</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Découvrez les algorithmes de graphe utilisés dans l'application (Dijkstra, Bellman-Ford, Prim, Kruskal).</p>
              <Link 
                href="/algorithms"
                className="block text-center bg-gradient-to-r from-teal-600 to-slate-600 hover:from-teal-700 hover:to-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Explorer
              </Link>
            </div>
          </div>
          
          {/* Carte 7: Aide */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-5 flex items-center">
              <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Aide et documentation</h3>
            </div>
            <div className="p-6">
              <p className="mb-5 text-gray-600">Consultez la documentation et les guides d'utilisation.</p>
              <Link 
                href="/about"
                className="block text-center bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm"
              >
                Consulter
              </Link>
            </div>
          </div>
        </div>
    </UserLayout>
  );
}
