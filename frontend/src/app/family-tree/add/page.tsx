'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FamilyTreeService } from '../../services/family-tree.service';

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
  
  // États pour gérer les nouveaux parents
  const [addNewMother, setAddNewMother] = useState(false);
  const [addNewFather, setAddNewFather] = useState(false);
  const [newMotherData, setNewMotherData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: ''
  });
  const [newFatherData, setNewFatherData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: ''
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
      
      // Charger les données des personnes depuis le service
      const familyData = FamilyTreeService.getSimulatedFamilyData();
      setPersons(familyData.persons);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Réinitialiser l'option d'ajout de nouveau parent si l'utilisateur sélectionne un parent existant
    if (name === 'mother' && value !== 'new') {
      setAddNewMother(false);
    } else if (name === 'mother' && value === 'new') {
      setAddNewMother(true);
      setFormData(prev => ({
        ...prev,
        mother: ''
      }));
      return;
    }
    
    if (name === 'father' && value !== 'new') {
      setAddNewFather(false);
    } else if (name === 'father' && value === 'new') {
      setAddNewFather(true);
      setFormData(prev => ({
        ...prev,
        father: ''
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestion des changements pour les nouveaux parents
  const handleNewMotherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMotherData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewFatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFatherData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
      setSubmitting(false);
      return;
    }
    
    // Validation des nouveaux parents
    if (addNewMother && (!newMotherData.firstName || !newMotherData.lastName)) {
      setMessage({ type: 'error', text: 'Veuillez remplir les champs obligatoires pour la nouvelle mère' });
      setSubmitting(false);
      return;
    }
    
    if (addNewFather && (!newFatherData.firstName || !newFatherData.lastName)) {
      setMessage({ type: 'error', text: 'Veuillez remplir les champs obligatoires pour le nouveau père' });
      setSubmitting(false);
      return;
    }

    try {
      // Créer les nouveaux parents si nécessaire
      let motherId = formData.mother;
      let fatherId = formData.father;
      
      if (addNewMother) {
        // Ajouter la nouvelle mère
        const newMother = FamilyTreeService.addSimulatedPerson({
          firstName: newMotherData.firstName,
          lastName: newMotherData.lastName,
          gender: 'female',
          birthDate: newMotherData.birthDate || undefined,
          birthPlace: newMotherData.birthPlace || undefined
        });
        
        if (newMother) {
          motherId = newMother.id.toString();
        }
      }
      
      if (addNewFather) {
        // Ajouter le nouveau père
        const newFather = FamilyTreeService.addSimulatedPerson({
          firstName: newFatherData.firstName,
          lastName: newFatherData.lastName,
          gender: 'male',
          birthDate: newFatherData.birthDate || undefined,
          birthPlace: newFatherData.birthPlace || undefined
        });
        
        if (newFather) {
          fatherId = newFather.id.toString();
        }
      }
      
      // Vérifier si les parents sélectionnés ne sont pas frères et sœurs
      if (fatherId && motherId) {
        const fatherIdNum = parseInt(fatherId as string);
        const motherIdNum = parseInt(motherId as string);
        
        if (!isNaN(fatherIdNum) && !isNaN(motherIdNum)) {
          const areSiblings = FamilyTreeService.areSiblings(fatherIdNum, motherIdNum);
          if (areSiblings) {
            setMessage({ type: 'error', text: 'Les parents sélectionnés sont frères et sœurs. Veuillez choisir d\'autres parents.' });
            setSubmitting(false);
            return;
          }
        }
      }
      
      // Préparer les données pour l'ajout
      const personData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        deathDate: formData.deathDate,
        notes: formData.biography,
        mother: motherId || undefined,
        father: fatherId || undefined
      };
      
      // Ajouter la personne aux données simulées
      const newPerson = FamilyTreeService.addSimulatedPerson(personData);
      
      console.log('Nouveau membre ajouté:', newPerson);
      
      // Afficher un message de succès
      setMessage({ type: 'success', text: 'Membre ajouté avec succès à l\'arbre généalogique!' });
      setSubmitting(false);
      
      // Rediriger vers la page principale après 2 secondes
      setTimeout(() => {
        router.push('/family-tree');
      }, 2000);
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du membre:', err);
      
      // Afficher le message d'erreur spécifique si disponible
      const errorMessage = err.message || 'Une erreur est survenue lors de l\'ajout du membre';
      setMessage({ type: 'error', text: errorMessage });
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Relations familiales et informations supplémentaires */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Relations familiales</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mother">
                    Mère
                  </label>
                  <select
                    id="mother"
                    name="mother"
                    value={formData.mother}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Sélectionner une mère (optionnel)</option>
                    <option value="new">➕ Ajouter une nouvelle mère</option>
                    {persons
                      .filter(person => person.gender === 'female')
                      .map(person => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    }
                  </select>
                  
                  {addNewMother && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                      <h3 className="font-bold mb-2 text-blue-600">Nouvelle mère</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="motherFirstName">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            id="motherFirstName"
                            name="firstName"
                            value={newMotherData.firstName}
                            onChange={handleNewMotherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="motherLastName">
                            Nom *
                          </label>
                          <input
                            type="text"
                            id="motherLastName"
                            name="lastName"
                            value={newMotherData.lastName}
                            onChange={handleNewMotherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="motherBirthDate">
                            Date de naissance
                          </label>
                          <input
                            type="date"
                            id="motherBirthDate"
                            name="birthDate"
                            value={newMotherData.birthDate}
                            onChange={handleNewMotherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="motherBirthPlace">
                            Lieu de naissance
                          </label>
                          <input
                            type="text"
                            id="motherBirthPlace"
                            name="birthPlace"
                            value={newMotherData.birthPlace}
                            onChange={handleNewMotherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="father">
                    Père
                  </label>
                  <select
                    id="father"
                    name="father"
                    value={formData.father}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Sélectionner un père (optionnel)</option>
                    <option value="new">➕ Ajouter un nouveau père</option>
                    {persons
                      .filter(person => person.gender === 'male')
                      .map(person => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    }
                  </select>
                  
                  {addNewFather && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                      <h3 className="font-bold mb-2 text-blue-600">Nouveau père</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="fatherFirstName">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            id="fatherFirstName"
                            name="firstName"
                            value={newFatherData.firstName}
                            onChange={handleNewFatherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="fatherLastName">
                            Nom *
                          </label>
                          <input
                            type="text"
                            id="fatherLastName"
                            name="lastName"
                            value={newFatherData.lastName}
                            onChange={handleNewFatherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="fatherBirthDate">
                            Date de naissance
                          </label>
                          <input
                            type="date"
                            id="fatherBirthDate"
                            name="birthDate"
                            value={newFatherData.birthDate}
                            onChange={handleNewFatherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="fatherBirthPlace">
                            Lieu de naissance
                          </label>
                          <input
                            type="text"
                            id="fatherBirthPlace"
                            name="birthPlace"
                            value={newFatherData.birthPlace}
                            onChange={handleNewFatherChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                    value={formData.biography}
                    onChange={handleChange}
                    rows={4}
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


