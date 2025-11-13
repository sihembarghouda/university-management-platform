import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BookOpen, Building2, UserCheck, FileText, Bell, Menu, X, TrendingUp, AlertCircle, Plus, Edit, Trash2, Search, Loader, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { departementService, enseignantService, etudiantService, classeService } from '../services/adminServices';
import AddStudentModal from './AddStudentModal';
import AddTeacherModal from './AddTeacherModal';
import AddDepartmentModal from './AddDepartmentModal';
import AddClasseModal from './AddClasseModal';
import EditStudentModal from './EditStudentModal';
import EditTeacherModal from './EditTeacherModal';
import EditDepartmentModal from './EditDepartmentModal';
import EditClasseModal from './EditClasseModal';

const AdminDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // États pour les modaux
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showAddClasseModal, setShowAddClasseModal] = useState(false);
  
  // États pour les modaux de modification
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [showEditClasseModal, setShowEditClasseModal] = useState(false);
  
  // États pour les éléments sélectionnés
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);

  // États pour les données
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    departments: 0,
    classes: 0
  });
  const [studentsData, setStudentsData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour le profil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    role: user?.role || 'Administrateur'
  });

  // Mettre à jour profileData quand user change
  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        role: user.role || 'Administrateur'
      });
    }
  }, [user]);

  // Chargement des statistiques au démarrage
  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Chargement des données selon le menu actif
  useEffect(() => {
    switch (activeMenu) {
      case 'students':
        loadStudents();
        break;
      case 'teachers':
        loadTeachers();
        break;
      case 'departments':
        loadDepartments();
        break;
      case 'subjects':
        loadClasses();
        break;
      default:
        break;
    }
  }, [activeMenu]);

  // Fonction pour charger les statistiques
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les données directement
      const [deptsData, ensData, etuData, classesData] = await Promise.all([
        departementService.getAll().catch(() => []),
        enseignantService.getAll().catch(() => ({ success: false, data: [] })),
        etudiantService.getAll().catch(() => ({ success: false, data: [] })),
        classeService.getAll().catch(() => [])
      ]);

      // Gérer le format { value: [...] } ou tableau direct
      const deptsArray = Array.isArray(deptsData) ? deptsData : (deptsData.value || deptsData.data || []);
      const ensArray = ensData.success ? (ensData.data || []) : (Array.isArray(ensData) ? ensData : (ensData.value || []));
      const etuArray = etuData.success ? (etuData.data || []) : (Array.isArray(etuData) ? etuData : (etuData.value || []));
      const classesArray = Array.isArray(classesData) ? classesData : (classesData.value || classesData.data || []);

      setStats({
        students: etuArray.length || 0,
        teachers: ensArray.length || 0,
        departments: deptsArray.length || 0,
        classes: classesArray.length || 0
      });
      
      console.log('📊 Statistiques chargées:', {
        students: etuArray.length,
        teachers: ensArray.length,
        departments: deptsArray.length,
        classes: classesArray.length
      });
    } catch (err) {
      console.error('❌ Erreur chargement stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les étudiants
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des étudiants...');
      const result = await etudiantService.getAll();
      console.log('📥 Résultat étudiants:', result);
      if (result.success) {
        setStudentsData(result.data || []);
        console.log('✅ Étudiants chargés:', result.data?.length || 0);
      } else {
        setError(result.message);
        console.error('❌ Erreur:', result.message);
      }
    } catch (err) {
      console.error('❌ Erreur chargement étudiants:', err);
      setError('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les enseignants
  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des enseignants...');
      const result = await enseignantService.getAll();
      console.log('📥 Résultat enseignants:', result);
      if (result.success) {
        setTeachersData(result.data || []);
        console.log('✅ Enseignants chargés:', result.data?.length || 0);
      } else {
        setError(result.message);
        console.error('❌ Erreur:', result.message);
      }
    } catch (err) {
      console.error('❌ Erreur chargement enseignants:', err);
      setError('Erreur lors du chargement des enseignants');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les départements
  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des départements...');
      const data = await departementService.getAll();
      console.log('📥 Résultat départements:', data);
      // L'API retourne soit un tableau, soit { value: [...] }
      const departmentsArray = Array.isArray(data) ? data : (data.value || []);
      setDepartmentsData(departmentsArray);
      console.log('✅ Départements chargés:', departmentsArray.length);
    } catch (err) {
      console.error('❌ Erreur chargement départements:', err);
      setError('Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les classes
  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des classes...');
      const data = await classeService.getAll();
      console.log('📥 Résultat classes:', data);
      // L'API retourne soit un tableau, soit { value: [...] }
      const classesArray = Array.isArray(data) ? data : (data.value || []);
      setClassesData(classesArray);
      console.log('✅ Classes chargées:', classesArray.length);
    } catch (err) {
      console.error('❌ Erreur chargement classes:', err);
      setError('Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un étudiant
  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;
    
    try {
      const result = await etudiantService.delete(id);
      if (result.success) {
        loadStudents();
        loadDashboardStats();
        alert('✅ Étudiant supprimé avec succès');
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert('❌ Erreur lors de la suppression');
    }
  };

  // Fonction pour modifier un étudiant
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditStudentModal(true);
  };

  // Fonction pour supprimer un enseignant
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return;
    
    try {
      const result = await enseignantService.delete(id);
      if (result.success) {
        loadTeachers();
        loadDashboardStats();
        alert('✅ Enseignant supprimé avec succès');
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert('❌ Erreur lors de la suppression');
    }
  };

  // Fonction pour modifier un enseignant
  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditTeacherModal(true);
  };

  // Fonction pour supprimer un département
  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
    
    try {
      const result = await departementService.delete(id);
      if (result.success) {
        loadDepartments();
        loadDashboardStats();
        alert('✅ Département supprimé avec succès');
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert('❌ Erreur lors de la suppression');
    }
  };

  // Fonction pour modifier un département
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowEditDepartmentModal(true);
  };

  // Fonction pour supprimer une classe
  const handleDeleteClasse = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) return;
    
    try {
      const result = await classeService.delete(id);
      if (result.success) {
        loadClasses();
        loadDashboardStats();
        alert('✅ Classe supprimée avec succès');
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert('❌ Erreur lors de la suppression');
    }
  };

  // Fonction pour modifier une classe
  const handleEditClasse = (classe) => {
    setSelectedClasse(classe);
    setShowEditClasseModal(true);
  };

  const recentActivities = [
    { type: 'user', message: 'Nouveau étudiant inscrit: Ahmed Ben Ali', time: 'Il y a 5 min' },
    { type: 'document', message: 'Rapport mensuel généré', time: 'Il y a 2h' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'students', label: 'Étudiants', icon: Users },
    { id: 'teachers', label: 'Enseignants', icon: UserCheck },
    { id: 'departments', label: 'Départements', icon: Building2 },
    { id: 'subjects', label: 'Classes', icon: BookOpen },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Mon Profil', icon: User }
  ];

  // Filtrer les données selon la recherche
  const filteredStudents = studentsData.filter(student => 
    student.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachersData.filter(teacher => 
    teacher.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departmentsData.filter(dept => 
    dept.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rendu du Dashboard
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users size={24} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-600">Actifs</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Étudiants</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.students}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <UserCheck size={24} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-green-600">Actifs</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Enseignants</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.teachers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-purple-600">Total</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Départements</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.departments}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-orange-600">Actives</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Classes</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.classes}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Statistiques par département</h3>
            <button 
              onClick={() => setActiveMenu('departments')} 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tout
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="space-y-4">
              {departmentsData.slice(0, 4).map((dept, index) => (
                <div key={dept.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{dept.nom}</h4>
                    <span className="text-sm text-gray-500">Code: {dept.code}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-blue-600" />
                      <span className="text-gray-600">Département {dept.code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Activités récentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.type === 'user' && <Users size={16} className="text-blue-600" />}
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

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => setActiveMenu('students')} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
            <Users size={24} className="mb-2" />
            <p className="font-medium">Gérer étudiants</p>
          </button>
          <button onClick={() => setActiveMenu('teachers')} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
            <UserCheck size={24} className="mb-2" />
            <p className="font-medium">Gérer enseignants</p>
          </button>
          <button onClick={() => setActiveMenu('departments')} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
            <Building2 size={24} className="mb-2" />
            <p className="font-medium">Gérer départements</p>
          </button>
          <button onClick={() => setActiveMenu('reports')} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left">
            <FileText size={24} className="mb-2" />
            <p className="font-medium">Générer rapport</p>
          </button>
        </div>
      </div>
    </>
  );

  // Rendu de la page Étudiants
  const renderStudents = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h3>
        <button 
          onClick={() => setShowAddStudentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter étudiant
        </button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un étudiant..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <AlertCircle size={40} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users size={40} className="mx-auto mb-4 text-gray-300" />
          <p>Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{student.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.prenom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.classe?.nom || 'Non assigné'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditStudent(student)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Rendu de la page Enseignants
  const renderTeachers = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestion des Enseignants</h3>
        <button 
          onClick={() => setShowAddTeacherModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter enseignant
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un enseignant..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <AlertCircle size={40} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <UserCheck size={40} className="mx-auto mb-4 text-gray-300" />
          <p>Aucun enseignant trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.prenom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.telephone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.grade || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTeacher(teacher)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Rendu de la page Départements
  const renderDepartments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestion des Départements</h3>
        <button 
          onClick={() => setShowAddDepartmentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter département
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <AlertCircle size={40} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Building2 size={40} className="mx-auto mb-4 text-gray-300" />
          <p>Aucun département trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{dept.nom}</h4>
                  <p className="text-sm text-gray-600">Code: {dept.code}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditDepartment(dept)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendu de la page Classes
  const renderSubjects = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Gestion des Classes</h3>
        <button 
          onClick={() => setShowAddClasseModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter classe
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : classesData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen size={40} className="mx-auto mb-4 text-gray-300" />
          <p>Aucune classe trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map((classe) => (
            <div key={classe.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{classe.nom}</h4>
                  <p className="text-sm text-gray-600">Code: {classe.code}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClasse(classe)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClasse(classe.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendu de la page Rapports
  const renderReports = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Rapports et Statistiques</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FileText size={20} />
          Générer rapport
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <FileText size={32} className="text-blue-600 mb-3" />
          <h4 className="text-lg font-bold text-gray-800 mb-2">Rapport Étudiants</h4>
          <p className="text-sm text-gray-600 mb-4">Liste complète des étudiants ({stats.students})</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Télécharger PDF</button>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <FileText size={32} className="text-green-600 mb-3" />
          <h4 className="text-lg font-bold text-gray-800 mb-2">Rapport Enseignants</h4>
          <p className="text-sm text-gray-600 mb-4">Liste complète des enseignants ({stats.teachers})</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Télécharger PDF</button>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <FileText size={32} className="text-purple-600 mb-3" />
          <h4 className="text-lg font-bold text-gray-800 mb-2">Rapport Départements</h4>
          <p className="text-sm text-gray-600 mb-4">Vue d'ensemble des départements ({stats.departments})</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Télécharger CSV</button>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <FileText size={32} className="text-orange-600 mb-3" />
          <h4 className="text-lg font-bold text-gray-800 mb-2">Rapport Institutionnel</h4>
          <p className="text-sm text-gray-600 mb-4">Vue d'ensemble de l'établissement</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Télécharger PDF</button>
        </div>
      </div>
    </div>
  );

  // Rendu de la page Notifications
  const renderNotifications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Centre de Notifications</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Nouvelle notification
        </button>
      </div>
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                {activity.type === 'user' && <Users size={20} className="text-blue-600" />}
                {activity.type === 'alert' && <AlertCircle size={20} className="text-orange-600" />}
                {activity.type === 'document' && <FileText size={20} className="text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium mb-1">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Marquer lu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Rendu de la page Profil
  const renderProfile = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
      // Mettre à jour le contexte utilisateur
      const result = updateUser(profileData);
      
      if (result.success) {
        setIsEditingProfile(false);
        alert('✅ Profil mis à jour avec succès!');
        console.log('Profil sauvegardé:', profileData);
      } else {
        alert('❌ Erreur lors de la mise à jour du profil');
      }
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User size={48} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user?.prenom} {user?.nom}</h2>
                <p className="text-blue-100 mt-1">{user?.role || 'Administrateur'}</p>
                <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Contenu du profil */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Informations personnelles</h3>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={18} />
                  Modifier
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={profileData.nom}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={profileData.prenom}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={profileData.telephone}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditingProfile ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={profileData.role}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Enregistrer les modifications
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileData({
                      nom: user?.nom || '',
                      prenom: user?.prenom || '',
                      email: user?.email || '',
                      telephone: user?.telephone || '',
                      role: user?.role || 'Administrateur'
                    });
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Annuler
                </button>
              </div>
            )}

            {/* Bouton de déconnexion */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    logout();
                    navigate('/login');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <LogOut size={18} />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour rendre le contenu selon le menu actif
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return renderDashboard();
      case 'students': return renderStudents();
      case 'teachers': return renderTeachers();
      case 'departments': return renderDepartments();
      case 'subjects': return renderSubjects();
      case 'reports': return renderReports();
      case 'notifications': return renderNotifications();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  };

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
          <div className="space-y-3">
            {/* Profil utilisateur */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.nom ? user.nom.charAt(0).toUpperCase() : 'A'}
                {user?.prenom ? user.prenom.charAt(0).toUpperCase() : 'D'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-blue-300 truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Tableau de bord'}
              </h2>
              <p className="text-sm text-gray-500">Plateforme de gestion universitaire</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={loadDashboardStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <TrendingUp size={18} />
                Actualiser
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Modaux */}
      <AddStudentModal 
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onStudentAdded={() => {
          loadStudents();
          loadDashboardStats();
        }}
      />

      <AddTeacherModal 
        isOpen={showAddTeacherModal}
        onClose={() => setShowAddTeacherModal(false)}
        onTeacherAdded={() => {
          loadTeachers();
          loadDashboardStats();
        }}
      />

      <AddDepartmentModal 
        isOpen={showAddDepartmentModal}
        onClose={() => setShowAddDepartmentModal(false)}
        onDepartmentAdded={() => {
          loadDepartments();
          loadDashboardStats();
        }}
      />

      <AddClasseModal 
        isOpen={showAddClasseModal}
        onClose={() => setShowAddClasseModal(false)}
        onClasseAdded={() => {
          loadClasses();
          loadDashboardStats();
        }}
      />

      {/* Modaux de modification */}
      <EditStudentModal 
        isOpen={showEditStudentModal}
        onClose={() => {
          setShowEditStudentModal(false);
          setSelectedStudent(null);
        }}
        onStudentUpdated={() => {
          loadStudents();
          loadDashboardStats();
        }}
        student={selectedStudent}
      />

      <EditTeacherModal 
        isOpen={showEditTeacherModal}
        onClose={() => {
          setShowEditTeacherModal(false);
          setSelectedTeacher(null);
        }}
        onTeacherUpdated={() => {
          loadTeachers();
          loadDashboardStats();
        }}
        teacher={selectedTeacher}
      />

      <EditDepartmentModal 
        isOpen={showEditDepartmentModal}
        onClose={() => {
          setShowEditDepartmentModal(false);
          setSelectedDepartment(null);
        }}
        onDepartmentUpdated={() => {
          loadDepartments();
          loadDashboardStats();
        }}
        department={selectedDepartment}
      />

      <EditClasseModal 
        isOpen={showEditClasseModal}
        onClose={() => {
          setShowEditClasseModal(false);
          setSelectedClasse(null);
        }}
        onClasseUpdated={() => {
          loadClasses();
          loadDashboardStats();
        }}
        classe={selectedClasse}
      />
    </div>
  );
};

export default AdminDashboard;