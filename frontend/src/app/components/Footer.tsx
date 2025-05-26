'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {currentYear} Arbre Généalogique - Projet de Recherche Opérationnelle</p>
      </div>
    </footer>
  );
}

//superman
