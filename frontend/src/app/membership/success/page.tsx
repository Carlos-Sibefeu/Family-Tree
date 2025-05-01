'use client';

import Link from 'next/link';
import PublicLayout from '../../components/PublicLayout';

export default function MembershipSuccess() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="mb-6 text-green-500">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Demande d'adhésion envoyée avec succès!</h1>
          
          <div className="text-gray-600 mb-8 max-w-lg mx-auto">
            <p className="mb-4">
              Nous avons bien reçu votre demande d'adhésion à notre application d'arbre généalogique.
            </p>
            <p className="mb-4">
              Un administrateur va examiner votre demande dans les plus brefs délais. Si votre demande est acceptée, 
              vous recevrez un email contenant vos identifiants de connexion.
            </p>
            <p>
              Merci de votre intérêt pour notre application!
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Que se passe-t-il maintenant?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">1</div>
                <p className="text-sm">Votre demande est en cours d'examen par notre équipe d'administration.</p>
              </div>
              
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">2</div>
                <p className="text-sm">Si votre demande est acceptée, vous recevrez un email avec vos identifiants de connexion.</p>
              </div>
              
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">3</div>
                <p className="text-sm">Vous pourrez alors vous connecter et commencer à explorer l'arbre généalogique.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
