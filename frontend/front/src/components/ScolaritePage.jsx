import React from 'react';
import { FileText, Download, CreditCard, Calendar } from 'lucide-react';

const ScolaritePage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Service Scolarité
          </h1>
          <p className="text-gray-600">Gérez vos documents administratifs et démarches</p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="mb-6">
            <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
              <FileText className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Espace Scolarité
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Cette section sera bientôt disponible. Vous pourrez y télécharger vos documents administratifs, 
            consulter vos attestations, gérer vos paiements et suivre vos demandes.
          </p>

          {/* Fonctionnalités à venir */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <Download className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Documents</h3>
              <p className="text-sm text-gray-600">Attestations, certificats et relevés</p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-xl">
              <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Paiements</h3>
              <p className="text-sm text-gray-600">Frais de scolarité et reçus</p>
            </div>
            
            <div className="p-6 bg-orange-50 rounded-xl">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Demandes</h3>
              <p className="text-sm text-gray-600">Suivi de vos demandes administratives</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
              Disponible prochainement
            </div>
          </div>
        </div>

        {/* Info contact */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📞 Contact Service Scolarité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-semibold">Bureau:</p>
              <p className="text-sm">Bâtiment A - 1er étage</p>
            </div>
            <div>
              <p className="font-semibold">Horaires:</p>
              <p className="text-sm">Lun-Ven: 8h00 - 16h00</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p className="text-sm">scolarite@enis.tn</p>
            </div>
            <div>
              <p className="font-semibold">Téléphone:</p>
              <p className="text-sm">+216 74 274 088</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScolaritePage;