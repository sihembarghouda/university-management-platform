import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, Building2, Calendar, UserCheck, FileText, Bell, Settings, Menu, X, ChevronDown, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Données simulées pour les statistiques
  const stats = [
    { label: 'Étudiants', value: '1,248', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Enseignants', value: '89', change: '+5%', icon: UserCheck, color: 'bg-green-500' },
    { label: 'Départements', value: '12', change: '0%', icon: Building2, color: 'bg-purple-500' },
    { label: 'Cours actifs', value: '156', change: '+8%', icon: BookOpen, color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { type: 'user', message: 'Nouveau étudiant inscrit: Ahmed Ben Ali', time: 'Il y a 5 min' },
    { type: 'calendar', message: 'Emploi du temps DSI3 modifié', time: 'Il y a 15 min' },
    { type: 'alert', message: '3 conflits d\'emploi du temps détectés', time: 'Il y a 1h' },
    { type: 'document', message: 'Rapport mensuel généré', time: 'Il y a 2h' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'students', label: 'Étudiants', icon: Users },
    { id: 'teachers', label: 'Enseignants', icon: UserCheck },
    { id: 'departments', label: 'Départements', icon: Building2 },
    { id: 'subjects', label: 'Matières', icon: BookOpen },
    { id: 'rooms', label: 'Salles', icon: Building2 },
    { id: 'schedules', label: 'Emplois du temps', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const departmentStats = [
    { name: 'Informatique', students: 342, teachers: 23, occupancy: '85%' },
    { name: 'Génie Civil', students: 289, teachers: 19, occupancy: '78%' },
    { name: 'Électrique', students: 267, teachers: 18, occupancy: '72%' },
    { name: 'Mécanique', students: 350, teachers: 29, occupancy: '92%' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && <h1 className="text-xl font-bold">ISET Tozeur</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeMenu === item.id
                  ? 'bg-blue-700 shadow-lg'
                  : 'hover:bg-blue-800'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
              HH
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-blue-300">Haithem Hafsi</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Tableau de bord administrateur</h2>
              <p className="text-sm text-gray-500">Bienvenue sur votre plateforme de gestion</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Exporter rapport
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Departements Stats */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Statistiques par département</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{dept.name}</h4>
                      <span className="text-sm text-gray-500">Occupation: {dept.occupancy}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span className="text-gray-600">{dept.students} étudiants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-green-600" />
                        <span className="text-gray-600">{dept.teachers} enseignants</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                        style={{ width: dept.occupancy }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Activités récentes</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'user' && <Users size={16} className="text-blue-600" />}
                      {activity.type === 'calendar' && <Calendar size={16} className="text-green-600" />}
                      {activity.type === 'alert' && <AlertCircle size={16} className="text-orange-600" />}
                      {activity.type === 'document' && <FileText size={16} className="text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
                <Users size={24} className="mb-2" />
                <p className="font-medium">Ajouter étudiant</p>
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
                <Calendar size={24} className="mb-2" />
                <p className="font-medium">Créer emploi</p>
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
                <FileText size={24} className="mb-2" />
                <p className="font-medium">Générer rapport</p>
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
                <Building2 size={24} className="mb-2" />
                <p className="font-medium">Gérer salles</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;