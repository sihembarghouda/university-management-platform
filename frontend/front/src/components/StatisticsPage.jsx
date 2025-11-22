import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Award, Clock, BookOpen } from 'lucide-react';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('annee');

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const statisticsData = {
      moyenneGenerale: 15.2,
      moyenneSemestre1: 14.8,
      moyenneSemestre2: 15.6,
      tauxReussite: 92,
      nombreModules: 11,
      modulesValides: 10,
      heuresPresence: 285,
      heuresTotal: 312,
      classement: 12,
      effectifTotal: 45,
      progression: [
        { mois: 'Sep', moyenne: 13.5 },
        { mois: 'Oct', moyenne: 14.2 },
        { mois: 'Nov', moyenne: 14.8 },
        { mois: 'Déc', moyenne: 15.1 },
        { mois: 'Jan', moyenne: 15.4 },
        { mois: 'Fév', moyenne: 15.2 },
      ],
      performanceParMatiere: [
        { matiere: 'IA', note: 18, max: 20 },
        { matiere: 'Prog', note: 17, max: 20 },
        { matiere: 'Math', note: 15.5, max: 20 },
        { matiere: 'Réseaux', note: 14.5, max: 20 },
        { matiere: 'BD', note: 13, max: 20 },
      ],
      absences: [
        { mois: 'Sep', jours: 0 },
        { mois: 'Oct', jours: 1 },
        { mois: 'Nov', jours: 0 },
        { mois: 'Déc', jours: 1 },
        { mois: 'Jan', jours: 0 },
        { mois: 'Fév', jours: 0 },
      ],
    };
    
    setStats(statisticsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Statistiques et Performance
          </h1>
          <p className="text-gray-600">Analyse détaillée de vos résultats académiques</p>
        </div>

        {/* Sélecteur de période */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setSelectedPeriod('semestre1')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'semestre1'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Semestre 1
          </button>
          <button
            onClick={() => setSelectedPeriod('semestre2')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'semestre2'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Semestre 2
          </button>
          <button
            onClick={() => setSelectedPeriod('annee')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedPeriod === 'annee'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Année Complète
          </button>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                +0.4
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.moyenneGenerale}/20</div>
            <div className="text-blue-100 text-sm">Moyenne Générale</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {stats.tauxReussite}%
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.modulesValides}/{stats.nombreModules}</div>
            <div className="text-green-100 text-sm">Modules Validés</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Top {Math.round((stats.classement / stats.effectifTotal) * 100)}%
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.classement}e</div>
            <div className="text-purple-100 text-sm">Classement / {stats.effectifTotal}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {Math.round((stats.heuresPresence / stats.heuresTotal) * 100)}%
              </span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.heuresPresence}h</div>
            <div className="text-orange-100 text-sm">Heures de Présence</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Évolution de la moyenne */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Évolution de la Moyenne
            </h3>
            <div className="space-y-3">
              {stats.progression.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600 w-12">{item.mois}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full flex items-center justify-end pr-3 text-white text-sm font-bold transition-all duration-500"
                      style={{ width: `${(item.moyenne / 20) * 100}%` }}
                    >
                      {item.moyenne}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance par matière */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Performance par Matière
            </h3>
            <div className="space-y-4">
              {stats.performanceParMatiere.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">{item.matiere}</span>
                    <span className="text-sm font-bold text-blue-600">{item.note}/{item.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.note >= 16 ? 'bg-green-500' :
                        item.note >= 12 ? 'bg-blue-500' :
                        item.note >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(item.note / item.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique des absences */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Suivi des Absences
          </h3>
          <div className="flex items-end justify-between gap-4 h-48">
            {stats.absences.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-40">
                  <div
                    className={`w-full ${
                      item.jours === 0 ? 'bg-green-500' :
                      item.jours === 1 ? 'bg-yellow-500' : 'bg-red-500'
                    } rounded-t-lg transition-all duration-500 flex items-center justify-center text-white font-bold`}
                    style={{ height: `${(item.jours / 3) * 100}%`, minHeight: item.jours > 0 ? '30px' : '0' }}
                  >
                    {item.jours > 0 && item.jours}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-600">{item.mois}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">0 absence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">1 absence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">2+ absences</span>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Recommandations</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Excellente progression ce semestre ! Continuez vos efforts en Programmation et IA.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">⚠</span>
              <span>Concentrez-vous sur Base de Données pour améliorer votre moyenne générale.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">ℹ</span>
              <span>Assiduité exemplaire ! Maintenez ce rythme pour assurer votre réussite.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;