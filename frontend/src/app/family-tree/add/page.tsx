'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddFamilyMember() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    birthPlace: '',
    deathDate: '',
    biography: '',
    mother: '',
    father: '',
    photo: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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
      
      // Simuler le chargement des données des personnes
      // Dans un projet réel, vous feriez un appel API ici
      setTimeout(() => {
        setPersons(samplePersons);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        photo: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      setMessage({ type: 'error', text: 'Le prénom et le nom sont obligatoires' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simuler l'envoi des données au backend
      // Dans un projet réel, vous feriez un appel API ici
      console.log('Form data submitted:', formData);
      
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Membre ajouté avec succès à l\'arbre généalogique!' });
        setSubmitting(false);
        
        // Réinitialiser le formulaire après 2 secondes
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            gender: 'male',
            birthDate: '',
            birthPlace: '',
            deathDate: '',
            biography: '',
            mother: '',
            father: '',
            photo: null
          });
          
          // Rediriger vers l'arbre généalogique
          router.push('/family-tree');
        }, 2000);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'ajout du membre' });
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Arbre Généalogique</h1>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="hover:underline">Tableau de bord</Link>
            <span>|</span>
            <Link href="/family-tree" className="hover:underline">Arbre généalogique</Link>
            <span>|</span>
            <span>Bonjour, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Ajouter un membre à l'arbre généalogique</h2>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Informations personnelles</h3>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu de naissance
                  </label>
                  <input
                    id="birthPlace"
                    name="birthPlace"
                    type="text"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de décès (si applicable)
                  </label>
                  <input
                    id="deathDate"
                    name="deathDate"
                    type="date"
                    value={formData.deathDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Relations familiales et informations supplémentaires */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Relations familiales</h3>
                
                <div>
                  <label htmlFor="father" className="block text-sm font-medium text-gray-700 mb-1">
                    Père
                  </label>
                  <select
                    id="father"
                    name="father"
                    value={formData.father}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner le père</option>
                    {persons
                      .filter(person => person.gender === 'male')
                      .map(person => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label htmlFor="mother" className="block text-sm font-medium text-gray-700 mb-1">
                    Mère
                  </label>
                  <select
                    id="mother"
                    name="mother"
                    value={formData.mother}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner la mère</option>
                    {persons
                      .filter(person => person.gender === 'female')
                      .map(person => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
                    Biographie
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    rows={5}
                    value={formData.biography}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/family-tree"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter le membre'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Informations importantes</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Les champs marqués d'un astérisque (*) sont obligatoires.</li>
            <li>Si vous ne connaissez pas la date exacte de naissance ou de décès, vous pouvez laisser ces champs vides.</li>
            <li>Vous pouvez ajouter des parents maintenant ou les associer plus tard.</li>
            <li>La photo doit être au format JPG, PNG ou GIF et ne pas dépasser 5 Mo.</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Arbre Généalogique - Projet de Recherche Opérationnelle</p>
        </div>
      </footer>
    </div>
  );
}

// Données d'exemple pour simuler une liste de personnes
const samplePersons = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', gender: 'male', birthDate: '1950-05-15' },
  { id: 2, firstName: 'Marie', lastName: 'Dupont', gender: 'female', birthDate: '1952-08-22' },
  { id: 3, firstName: 'Pierre', lastName: 'Dupont', gender: 'male', birthDate: '1975-03-10' },
  { id: 4, firstName: 'Sophie', lastName: 'Dupont', gender: 'female', birthDate: '1978-11-05' },
  { id: 5, firstName: 'Luc', lastName: 'Dupont', gender: 'male', birthDate: '1980-07-30' },
  { id: 6, firstName: 'Emma', lastName: 'Martin', gender: 'female', birthDate: '1979-04-18' },
  { id: 7, firstName: 'Thomas', lastName: 'Dupont', gender: 'male', birthDate: '2005-12-03' },
  { id: 8, firstName: 'Léa', lastName: 'Dupont', gender: 'female', birthDate: '2008-09-21' },
];
