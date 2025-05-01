'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserLayout from '../components/UserLayout';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordChanging, setPasswordChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        ...formData,
        username: userData.username,
        email: userData.email
      });
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler la mise à jour du profil
    // Dans un projet réel, vous feriez un appel API au backend
    setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
    
    // Mettre à jour les données utilisateur dans le localStorage
    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    
    setPasswordChanging(true);
    
    // Simuler le changement de mot de passe
    // Dans un projet réel, vous feriez un appel API au backend
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès!' });
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordChanging(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-xl">Chargement des données...</div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
        <h2 className="text-2xl font-bold mb-8">Profil utilisateur</h2>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations de profil */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Informations personnelles</h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Mettre à jour le profil
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Changer le mot de passe</h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={passwordChanging}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {passwordChanging ? 'Changement en cours...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Préférences</h3>
              
              <div className="space-y-3">
                <Link 
                  href="/family-tree"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                >
                  Voir mon arbre généalogique
                </Link>
                
                <Link 
                  href="/family-tree/add"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                >
                  Ajouter un membre
                </Link>
                
                <button 
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                  onClick={() => confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.') && alert('Fonctionnalité non implémentée dans cette démo')}
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Informations du compte</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="font-medium">{user?.roles?.includes('ROLE_ADMIN') ? 'Administrateur' : user?.roles?.includes('ROLE_EDITOR') ? 'Éditeur' : 'Utilisateur'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p className="font-medium">22 avril 2025</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Dernière connexion</p>
                  <p className="font-medium">Aujourd'hui à 07:00</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Link 
                  href="/family-tree"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                >
                  Voir mon arbre généalogique
                </Link>
                
                <Link 
                  href="/family-tree/add"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                >
                  Ajouter un membre
                </Link>
                
                <button 
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                  onClick={() => confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.') && alert('Fonctionnalité non implémentée dans cette démo')}
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
    </UserLayout>
  );
}
