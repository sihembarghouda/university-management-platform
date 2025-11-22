import React from 'react';
import { Library, BookOpen, Search } from 'lucide-react';

const BibliotequePage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <Library className="w-8 h-8 text-blue-600" />
            Bibliothèque Universitaire
          </h1>
          <p className="text-gray-600">Accédez aux ressources pédagogiques et documentaires</p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="mb-6">
            <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bibliothèque Numérique
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Cette section sera bientôt disponible. Vous pourrez y consulter le catalogue des livres, 
            rechercher des ouvrages, gérer vos emprunts et accéder aux ressources numériques.
          </p>

          {/* Fonctionnalités à venir */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <Search className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Catalogue en ligne</h3>
              <p className="text-sm text-gray-600">Recherchez parmi plus de 10,000 ouvrages</p>
            </div>
            
            <div className="p-6 bg-indigo-50 rounded-xl">
              <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Mes emprunts</h3>
              <p className="text-sm text-gray-600">Gérez vos emprunts et réservations</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-xl">
              <Library className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">E-ressources</h3>
              <p className="text-sm text-gray-600">Accès aux bases de données et e-books</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
              Disponible prochainement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliotequePage;