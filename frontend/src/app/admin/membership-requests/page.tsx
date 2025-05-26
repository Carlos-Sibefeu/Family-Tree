'use client';
//importation pk
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

// Types pour les demandes d'adhésion
interface MembershipRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: string;
  country: string;
  city: string;
  phone: string;
  motivation: string;
  photoUrl: string;
  idCardUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function MembershipRequests() {
  // État pour stocker les demandes d'adhésion
  const [requests, setRequests] = useState<MembershipRequest[]>([
    {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@example.com',
      gender: 'female',
      birthDate: '1985-06-15',
      country: 'France',
      city: 'Paris',
      phone: '+33612345678',
      motivation: 'Je souhaite retrouver mes ancêtres et partager mon histoire familiale avec mes enfants.',
      photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      idCardUrl: '/id-card-placeholder.jpg',
      status: 'pending',
      createdAt: '2025-05-01T08:45:00Z'
    },
    {
      id: 2,
      firstName: 'Thomas',
      lastName: 'Bernard',
      email: 'thomas.bernard@example.com',
      gender: 'male',
      birthDate: '1978-11-23',
      country: 'France',
      city: 'Lyon',
      phone: '+33687654321',
      motivation: 'Je m\'intéresse à la généalogie depuis plusieurs années et je souhaite utiliser votre outil pour organiser mes recherches.',
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      idCardUrl: '/id-card-placeholder.jpg',
      status: 'pending',
      createdAt: '2025-04-30T14:15:00Z'
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@example.com',
      gender: 'female',
      birthDate: '1990-03-08',
      country: 'France',
      city: 'Marseille',
      phone: '+33698765432',
      motivation: 'Je souhaite créer un arbre généalogique pour ma famille et partager notre histoire avec les générations futures.',
      photoUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      idCardUrl: '/id-card-placeholder.jpg',
      status: 'pending',
      createdAt: '2025-04-29T10:30:00Z'
    }
  ]);

  // État pour stocker la demande sélectionnée pour affichage détaillé
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  
  // État pour stocker les identifiants générés pour un utilisateur approuvé
  const [generatedCredentials, setGeneratedCredentials] = useState<{ username: string; password: string; requestId: number } | null>(null);
  
  // État pour le filtre de statut
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Fonction pour générer un nom d'utilisateur basé sur le nom et prénom
  const generateUsername = (firstName: string, lastName: string) => {
    const firstNameNormalized = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lastNameNormalized = lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return `${firstNameNormalized.charAt(0)}${lastNameNormalized}`;
  };

  // Fonction pour générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Fonction pour approuver une demande
  const approveRequest = (requestId: number) => {
    // Générer des identifiants
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    const username = generateUsername(request.firstName, request.lastName);
    const password = generatePassword();
    
    // Mettre à jour le statut de la demande
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    
    // Stocker les identifiants générés
    setGeneratedCredentials({ username, password, requestId });
    
    // Fermer le modal de détails
    setSelectedRequest(null);
  };

  // Fonction pour rejeter une demande
  const rejectRequest = (requestId: number) => {
    // Mettre à jour le statut de la demande
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
    
    // Fermer le modal de détails
    setSelectedRequest(null);
  };

  // Filtrer les demandes selon le statut sélectionné
  const filteredRequests = statusFilter === 'all' 
    ? requests 
    : requests.filter(req => req.status === statusFilter);
  
    const showAccessCredentials = (requestId: number) => {
      const request = requests.find(r => r.id === requestId);
      if (!request || request.status !== 'approved') return;
      
      // Dans un cas réel, vous récupéreriez les identifiants existants de l'utilisateur depuis votre API
      // Ici on simule en les régénérant
      const username = generateUsername(request.firstName, request.lastName);
      const password = "••••••••"; // Mot de passe masqué car on ne doit pas pouvoir le voir à nouveau
      
      setGeneratedCredentials({ username, password, requestId });
    };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Demandes d'adhésion</h1>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md ${
                statusFilter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-md ${
                statusFilter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              En attente
            </button>
            <button 
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1 rounded-md ${
                statusFilter === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Approuvées
            </button>
            <button 
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1 rounded-md ${
                statusFilter === 'rejected' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Rejetées
            </button>
          </div>
        </div>
        
        {/* Liste des demandes */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demandeur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de demande
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revoir les paramètres d'accès
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={request.photoUrl} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.gender === 'male' ? 'Homme' : 'Femme'}, {new Date().getFullYear() - new Date(request.birthDate).getFullYear()} ans
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.email}</div>
                      <div className="text-sm text-gray-500">{request.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : request.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' 
                          ? 'En attente' 
                          : request.status === 'approved' 
                            ? 'Approuvée' 
                            : 'Rejetée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <button 
    onClick={() => setSelectedRequest(request)}
    className="text-indigo-600 hover:text-indigo-900 mr-3"
  >
    Détails
  </button>
  {request.status === 'pending' && (
    <>
      <button 
        onClick={() => approveRequest(request.id)}
        className="text-green-600 hover:text-green-900 mr-3"
      >
        Approuver
      </button>
      <button 
        onClick={() => rejectRequest(request.id)}
        className="text-red-600 hover:text-red-900"
      >
        Rejeter
      </button>
    </>
  )}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  {request.status === 'approved' ? (
    <button 
      onClick={() => {
        // Pour les demandes approuvées, recréer les identifiants et afficher le modal
        const username = generateUsername(request.firstName, request.lastName);
        const password = generatePassword(); // Note: Dans un cas réel, vous ne régénéreriez pas le mot de passe ici
        setGeneratedCredentials({ username, password, requestId: request.id });
      }}
      className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-300 rounded-md hover:bg-blue-50"
    >
      Voir identifiants
    </button>
  ) : request.status === 'pending' ? (
    <button 
      onClick={() => setSelectedRequest(request)}
      className="text-gray-600 hover:text-gray-900 px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      Paramètres d'accès
    </button>
  ) : (
    <span className="text-gray-400">Non disponible</span>
  )}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Modal de détails de la demande */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold">
                  Demande de {selectedRequest.firstName} {selectedRequest.lastName}
                </h3>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations personnelles */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4">Informations personnelles</h4>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Prénom:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.firstName}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Nom:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.lastName}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Email:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.email}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Genre:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.gender === 'male' ? 'Homme' : 'Femme'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Date de naissance:</span>
                        <span className="w-2/3 font-medium">{new Date(selectedRequest.birthDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Pays:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.country}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Ville:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.city}</span>
                      </div>
                      <div className="flex">
                        <span className="w-1/3 text-gray-600">Téléphone:</span>
                        <span className="w-2/3 font-medium">{selectedRequest.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4">Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 mb-2">Photo</p>
                        <img 
                          src={selectedRequest.photoUrl} 
                          alt="Photo" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Pièce d'identité</p>
                        <img 
                          src={selectedRequest.idCardUrl} 
                          alt="Pièce d'identité" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Motivation */}
                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-2">Motivation</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-800">{selectedRequest.motivation}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => rejectRequest(selectedRequest.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Rejeter
                      </button>
                      <button 
                        onClick={() => approveRequest(selectedRequest.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approuver
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal des identifiants générés */}
        {generatedCredentials && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-start p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
  {requests.find(r => r.id === generatedCredentials.requestId)?.status === 'approved' 
    ? "Paramètres d'accès" 
    : "Identifiants générés"}
</h3>
                <button 
                  onClick={() => setGeneratedCredentials(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {requests.find(r => r.id === generatedCredentials.requestId)?.status !== 'approved' && (
  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
    <p className="text-green-800">
      La demande a été approuvée avec succès. Voici les identifiants générés pour l'utilisateur.
    </p>
  </div>
)}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={generatedCredentials.username}
                        readOnly
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedCredentials.username)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                        title="Copier"
                      >
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={generatedCredentials.password}
                        readOnly
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedCredentials.password)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                        title="Copier"
                      >
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  
                  
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={() => setGeneratedCredentials(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Fermer
                    </button>
                   
                  </div>
                </div>
              </div>
            </div>
          
        )}
      </div>
    </AdminLayout>
  );
}
