import React, { useState, useEffect } from 'react';
import { adminApi } from '../config/api';

const TestConnection = () => {
  const [results, setResults] = useState({
    etudiants: { loading: true, data: null, error: null },
    enseignants: { loading: true, data: null, error: null },
    departements: { loading: true, data: null, error: null }
  });

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    console.log('🧪 Début des tests de connexion...');
    
    // Test Étudiants
    try {
      console.log('🔄 Test étudiants...');
      const response = await adminApi.get('/etudiants');
      console.log('✅ Étudiants OK:', response.data);
      setResults(prev => ({
        ...prev,
        etudiants: { loading: false, data: response.data, error: null }
      }));
    } catch (error) {
      console.error('❌ Erreur étudiants:', error);
      setResults(prev => ({
        ...prev,
        etudiants: { loading: false, data: null, error: error.message }
      }));
    }

    // Test Enseignants
    try {
      console.log('🔄 Test enseignants...');
      const response = await adminApi.get('/enseignant');
      console.log('✅ Enseignants OK:', response.data);
      setResults(prev => ({
        ...prev,
        enseignants: { loading: false, data: response.data, error: null }
      }));
    } catch (error) {
      console.error('❌ Erreur enseignants:', error);
      setResults(prev => ({
        ...prev,
        enseignants: { loading: false, data: null, error: error.message }
      }));
    }

    // Test Départements
    try {
      console.log('🔄 Test départements...');
      const response = await adminApi.get('/departement');
      console.log('✅ Départements OK:', response.data);
      setResults(prev => ({
        ...prev,
        departements: { loading: false, data: response.data, error: null }
      }));
    } catch (error) {
      console.error('❌ Erreur départements:', error);
      setResults(prev => ({
        ...prev,
        departements: { loading: false, data: null, error: error.message }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">🧪 Test de Connexion API</h1>
          <p className="text-gray-600 mb-6">Vérification de la connexion React ↔️ Backend</p>
          
          <button 
            onClick={testConnections}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md mb-6"
          >
            🔄 Re-tester
          </button>

          <div className="space-y-4">
            {/* Test Étudiants */}
            <div className={`p-4 rounded-lg border-l-4 ${
              results.etudiants.loading ? 'bg-gray-50 border-gray-400' :
              results.etudiants.error ? 'bg-red-50 border-red-500' :
              'bg-green-50 border-green-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {results.etudiants.loading ? '⏳' : results.etudiants.error ? '❌' : '✅'} 
                    {' '}Étudiants
                  </h3>
                  {results.etudiants.loading && <p className="text-sm text-gray-600">Chargement...</p>}
                  {results.etudiants.error && <p className="text-sm text-red-600">{results.etudiants.error}</p>}
                  {results.etudiants.data && (
                    <p className="text-sm text-green-600">
                      {results.etudiants.data.length} étudiants récupérés
                    </p>
                  )}
                </div>
                {results.etudiants.data && (
                  <span className="text-3xl font-bold text-green-600">
                    {results.etudiants.data.length}
                  </span>
                )}
              </div>
              {results.etudiants.data && results.etudiants.data.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded text-sm">
                  <p className="font-semibold mb-1">Premiers étudiants:</p>
                  {results.etudiants.data.slice(0, 3).map(etu => (
                    <p key={etu.id} className="text-gray-700">
                      • {etu.nom} {etu.prenom} - {etu.email}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Test Enseignants */}
            <div className={`p-4 rounded-lg border-l-4 ${
              results.enseignants.loading ? 'bg-gray-50 border-gray-400' :
              results.enseignants.error ? 'bg-red-50 border-red-500' :
              'bg-green-50 border-green-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {results.enseignants.loading ? '⏳' : results.enseignants.error ? '❌' : '✅'} 
                    {' '}Enseignants
                  </h3>
                  {results.enseignants.loading && <p className="text-sm text-gray-600">Chargement...</p>}
                  {results.enseignants.error && <p className="text-sm text-red-600">{results.enseignants.error}</p>}
                  {results.enseignants.data && (
                    <p className="text-sm text-green-600">
                      {results.enseignants.data.length} enseignants récupérés
                    </p>
                  )}
                </div>
                {results.enseignants.data && (
                  <span className="text-3xl font-bold text-green-600">
                    {results.enseignants.data.length}
                  </span>
                )}
              </div>
            </div>

            {/* Test Départements */}
            <div className={`p-4 rounded-lg border-l-4 ${
              results.departements.loading ? 'bg-gray-50 border-gray-400' :
              results.departements.error ? 'bg-red-50 border-red-500' :
              'bg-green-50 border-green-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {results.departements.loading ? '⏳' : results.departements.error ? '❌' : '✅'} 
                    {' '}Départements
                  </h3>
                  {results.departements.loading && <p className="text-sm text-gray-600">Chargement...</p>}
                  {results.departements.error && <p className="text-sm text-red-600">{results.departements.error}</p>}
                  {results.departements.data && (
                    <p className="text-sm text-green-600">
                      {results.departements.data.length} départements récupérés
                    </p>
                  )}
                </div>
                {results.departements.data && (
                  <span className="text-3xl font-bold text-green-600">
                    {results.departements.data.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2 text-blue-800">📋 Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Ouvrez la console du navigateur (F12)</li>
              <li>Regardez les logs 🔄 et ✅/❌</li>
              <li>Si tout est ✅, le dashboard fonctionnera !</li>
              <li>Si ❌, copiez l'erreur de la console</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Résumé</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {[results.etudiants, results.enseignants, results.departements]
                  .filter(r => !r.loading && !r.error).length}
              </div>
              <div className="text-sm text-gray-600">Tests Réussis</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {[results.etudiants, results.enseignants, results.departements]
                  .filter(r => r.error).length}
              </div>
              <div className="text-sm text-gray-600">Tests Échoués</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Tests Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
