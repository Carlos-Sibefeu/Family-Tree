'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simuler une requête API (à remplacer par une vraie requête au backend)
      // const response = await fetch('http://localhost:8080/api/auth/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Identifiants incorrects');
      // }
      
      // const data = await response.json();
      // localStorage.setItem('token', data.accessToken);
      // localStorage.setItem('user', JSON.stringify(data));
      
      // Simulation pour le développement
      console.log('Login successful:', { username, password });
      localStorage.setItem('token', 'fake-jwt-token');
      
      // Vérifier si c'est un administrateur (pour la démo, admin/admin)
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('user', JSON.stringify({ 
          id: 1, 
          username, 
          email: `${username}@example.com`,
          roles: ['ROLE_USER', 'ROLE_ADMIN']
        }));
        
        // Rediriger vers le tableau de bord admin
        router.push('/admin/dashboard');
      } else {
        localStorage.setItem('user', JSON.stringify({ 
          id: 1, 
          username, 
          email: `${username}@example.com`,
          roles: ['ROLE_USER']
        }));
        
        // Rediriger vers le tableau de bord utilisateur
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Utilisateur normal :</strong> Utilisez n'importe quel nom d'utilisateur/mot de passe (sauf admin/admin).
            </p>
            <p className="text-sm text-blue-700 mt-2">
              <strong>Administrateur :</strong> Utilisez admin/admin pour accéder au tableau de bord administrateur.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
              
              <div className="mt-4 text-center">
                <Link href="/routes" className="text-blue-600 hover:text-blue-800 text-sm">
                  Voir toutes les routes disponibles
                </Link>
              </div>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore membre ?{' '}
              <Link href="/membership/apply" className="font-medium text-blue-600 hover:text-blue-500">
                Faire une demande d'adhésion
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Retour à l'accueil
          </Link>
        </div>
        </div>
      </div>
    </PublicLayout>
  );
}
