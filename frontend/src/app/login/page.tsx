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
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Connexion</h1>
              <p className="text-gray-600 mt-2">Bienvenue sur Family Tree</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : 'Se connecter'}
              </button>
              
              <div className="mt-4 text-center">
                <Link href="/routes" className="text-blue-600 hover:text-blue-800 text-sm">
                  Voir toutes les routes disponibles
                </Link>
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
