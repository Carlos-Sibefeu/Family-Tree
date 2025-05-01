'use client';

import Link from 'next/link';
import UserLayout from '../components/UserLayout';

export default function Dashboard() {

  return (
    <UserLayout>
        <h2 className="text-2xl font-bold mb-8">Tableau de bord</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte 1: Arbre généalogique */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Arbre généalogique</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Visualisez et explorez votre arbre généalogique familial.</p>
              <Link 
                href="/family-tree"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Voir l'arbre
              </Link>
            </div>
          </div>
          
          {/* Carte 2: Recherche de parenté */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Recherche de parenté</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Découvrez les liens de parenté entre les membres de votre famille.</p>
              <Link 
                href="/search"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Rechercher
              </Link>
            </div>
          </div>
          
          {/* Carte 3: Profil */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Profil utilisateur</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Gérez votre profil et vos préférences.</p>
              <Link 
                href="/profile"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Mon profil
              </Link>
            </div>
          </div>
          
          {/* Carte 4: Ajouter un membre */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Ajouter un membre</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Ajoutez un nouveau membre à votre arbre généalogique.</p>
              <Link 
                href="/family-tree/add"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Ajouter
              </Link>
            </div>
          </div>
          
          {/* Carte 5: Profil */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Profil utilisateur</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Gérez votre profil et vos préférences.</p>
              <Link 
                href="/profile"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Mon profil
              </Link>
            </div>
          </div>
          
          {/* Carte 6: Algorithmes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Algorithmes</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Découvrez les algorithmes de graphe utilisés dans l'application (Dijkstra, Bellman-Ford, Prim, Kruskal).</p>
              <Link 
                href="/algorithms"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Explorer
              </Link>
            </div>
          </div>
          
          {/* Carte 7: Aide */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-semibold">Aide et documentation</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Consultez la documentation et les guides d'utilisation.</p>
              <Link 
                href="/about"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Consulter
              </Link>
            </div>
          </div>
        </div>
    </UserLayout>
  );
}
