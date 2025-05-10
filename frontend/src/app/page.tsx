'use client';

import PublicLayout from './components/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <PublicLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">Découvrez Votre Histoire Familiale</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Bienvenue sur notre application d'arbre généalogique. Explorez, visualisez et partagez 
            l'histoire de votre famille grâce à nos outils avancés d'analyse et de visualisation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/membership/apply" 
              className="bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Faire une demande d'adhésion
            </Link>
            <Link 
              href="/login" 
              className="bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 font-medium py-3 px-6 rounded-md transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-700 text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold mb-2">Visualisation interactive</h3>
              <p className="text-gray-600">
                Explorez votre arbre généalogique de manière interactive avec notre interface intuitive.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-700 text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Recherche avancée</h3>
              <p className="text-gray-600">
                Trouvez facilement des liens de parenté et découvrez des connexions familiales insoupçonnées.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-teal-700 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analyse de structure</h3>
              <p className="text-gray-600">
                Utilisez des algorithmes avancés pour analyser la structure de votre arbre généalogique.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="bg-teal-100 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h3 className="font-semibold mb-2">Demande d'adhésion</h3>
              <p className="text-gray-600 text-sm">Remplissez le formulaire de demande d'adhésion avec vos informations personnelles.</p>
            </div>
            
            <div className="p-4">
              <div className="bg-teal-100 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h3 className="font-semibold mb-2">Validation</h3>
              <p className="text-gray-600 text-sm">Un administrateur examine votre demande et vous envoie vos identifiants de connexion.</p>
            </div>
            
            <div className="p-4">
              <div className="bg-teal-100 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h3 className="font-semibold mb-2">Connexion</h3>
              <p className="text-gray-600 text-sm">Connectez-vous à votre compte avec les identifiants fournis par l'administrateur.</p>
            </div>
            
            <div className="p-4">
              <div className="bg-teal-100 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">4</div>
              <h3 className="font-semibold mb-2">Exploration</h3>
              <p className="text-gray-600 text-sm">Commencez à explorer et à contribuer à l'arbre généalogique familial.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-teal-700 to-slate-700 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir votre histoire familiale?</h2>
          <p className="text-xl mb-6">Rejoignez notre communauté et commencez à explorer vos racines dès aujourd'hui.</p>
          <Link 
            href="/membership/apply" 
            className="bg-white text-teal-700 hover:bg-teal-50 font-medium py-3 px-8 rounded-md transition-colors inline-block"
          >
            Faire une demande d'adhésion
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
}
