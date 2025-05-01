'use client';

import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';

export default function Routes() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Routes disponibles</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Cette page liste toutes les routes disponibles dans l'application et explique comment y accéder.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Routes publiques */}
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Routes publiques</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /
                    </div>
                    <div>
                      <p className="font-medium">Page d'accueil</p>
                      <p className="text-sm text-gray-600">Présentation de l'application</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /about
                    </div>
                    <div>
                      <p className="font-medium">À propos</p>
                      <p className="text-sm text-gray-600">Informations sur le projet</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /membership/apply
                    </div>
                    <div>
                      <p className="font-medium">Demande d'adhésion</p>
                      <p className="text-sm text-gray-600">Formulaire pour demander l'accès à l'application</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /membership/success
                    </div>
                    <div>
                      <p className="font-medium">Confirmation de demande</p>
                      <p className="text-sm text-gray-600">Page de confirmation après soumission du formulaire</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /login
                    </div>
                    <div>
                      <p className="font-medium">Connexion</p>
                      <p className="text-sm text-gray-600">Page de connexion pour les utilisateurs</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Routes utilisateur */}
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Routes utilisateur (nécessite une connexion)</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /dashboard
                    </div>
                    <div>
                      <p className="font-medium">Tableau de bord</p>
                      <p className="text-sm text-gray-600">Tableau de bord principal de l'utilisateur</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /family-tree
                    </div>
                    <div>
                      <p className="font-medium">Arbre généalogique</p>
                      <p className="text-sm text-gray-600">Visualisation de l'arbre généalogique</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /family-tree/add
                    </div>
                    <div>
                      <p className="font-medium">Ajouter un membre</p>
                      <p className="text-sm text-gray-600">Formulaire pour ajouter un membre à l'arbre</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /family-tree/edit/:id
                    </div>
                    <div>
                      <p className="font-medium">Modifier un membre</p>
                      <p className="text-sm text-gray-600">Formulaire pour modifier un membre existant</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /family-tree/analysis
                    </div>
                    <div>
                      <p className="font-medium">Analyse de structure</p>
                      <p className="text-sm text-gray-600">Analyse de la structure de l'arbre généalogique</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /search
                    </div>
                    <div>
                      <p className="font-medium">Recherche de parenté</p>
                      <p className="text-sm text-gray-600">Recherche de liens entre membres de la famille</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /algorithms
                    </div>
                    <div>
                      <p className="font-medium">Algorithmes</p>
                      <p className="text-sm text-gray-600">Exploration des algorithmes utilisés (Dijkstra, Bellman-Ford, Prim, Kruskal)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /profile
                    </div>
                    <div>
                      <p className="font-medium">Profil utilisateur</p>
                      <p className="text-sm text-gray-600">Gestion du profil et des préférences</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Routes administrateur */}
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Routes administrateur</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700">
                    <strong>Note :</strong> Ces routes nécessitent un compte administrateur. Pour accéder au tableau de bord administrateur, vous devez vous connecter avec un compte ayant le rôle "ROLE_ADMIN".
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /admin/dashboard
                    </div>
                    <div>
                      <p className="font-medium">Tableau de bord admin</p>
                      <p className="text-sm text-gray-600">Tableau de bord principal de l'administrateur</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /admin/membership-requests
                    </div>
                    <div>
                      <p className="font-medium">Demandes d'adhésion</p>
                      <p className="text-sm text-gray-600">Gestion des demandes d'adhésion</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /admin/users
                    </div>
                    <div>
                      <p className="font-medium">Gestion des utilisateurs</p>
                      <p className="text-sm text-gray-600">Administration des comptes utilisateurs</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /admin/family-tree
                    </div>
                    <div>
                      <p className="font-medium">Gestion de l'arbre</p>
                      <p className="text-sm text-gray-600">Administration de l'arbre généalogique</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 font-mono text-sm">
                      /admin/settings
                    </div>
                    <div>
                      <p className="font-medium">Paramètres</p>
                      <p className="text-sm text-gray-600">Configuration de l'application</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Connexion au backend */}
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Connexion au backend SQLite</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="mb-4">
                  Pour connecter l'application au backend SQLite, suivez ces étapes :
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <p className="font-medium">Configuration du backend</p>
                    <p className="text-sm text-gray-600">
                      Assurez-vous que le serveur backend est correctement configuré et en cours d'exécution.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">Mise à jour des services API</p>
                    <p className="text-sm text-gray-600">
                      Dans le dossier <code>src/app/services</code>, modifiez les fichiers de service pour pointer vers votre API backend au lieu d'utiliser des données simulées.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">Configuration de l'authentification</p>
                    <p className="text-sm text-gray-600">
                      Mettez à jour le service d'authentification pour utiliser les endpoints de votre API.
                    </p>
                  </li>
                </ol>
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-700">
                    <strong>Exemple :</strong> Pour connecter le service d'authentification, modifiez le fichier <code>src/app/services/auth.service.ts</code> pour remplacer les fonctions simulées par des appels API réels.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
