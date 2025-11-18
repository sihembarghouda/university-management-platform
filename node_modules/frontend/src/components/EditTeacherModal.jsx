import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { departementService, enseignantService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const EditTeacherModal = ({ isOpen, onClose, onTeacherUpdated, teacher }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    cin: '',
    telephone: '',
    grade: '',
    role: 'enseignant',
    departementId: '',
    specialiteEnseignementId: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [specialitesEnseignement, setSpecialitesEnseignement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingSpecialites, setLoadingSpecialites] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && teacher) {
      setFormData({
        nom: teacher.nom || '',
        prenom: teacher.prenom || '',
        email: teacher.email || '',
        cin: teacher.cin || '',
        telephone: teacher.telephone || '',
        grade: teacher.grade || '',
        role: teacher.role || 'enseignant',
        departementId: teacher.departementId || teacher.departement?.id || '',
        specialiteEnseignementId: teacher.specialiteEnseignementId || teacher.specialiteEnseignement?.id || ''
      });
      loadDepartments();
      loadSpecialitesEnseignement();
    }
  }, [isOpen, teacher]);

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const data = await departementService.getAll();
      setDepartments(Array.isArray(data) ? data : (data.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const loadSpecialitesEnseignement = async () => {
    try {
      setLoadingSpecialites(true);
      const response = await fetch('http://localhost:3000/specialite-enseignement');
      const data = await response.json();
      setSpecialitesEnseignement(Array.isArray(data) ? data : (data.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités d\'enseignement:', error);
    } finally {
      setLoadingSpecialites(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.cin.trim()) newErrors.cin = 'Le CIN est requis';
    if (!formData.departementId) newErrors.departementId = 'Le département est requis';
    if (!formData.specialiteEnseignementId) {
      newErrors.specialiteEnseignementId = 'La spécialité d\'enseignement est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await enseignantService.update(teacher.id, formData);
      
      if (result.success) {
        alert('✅ Enseignant modifié avec succès!');
        onTeacherUpdated();
        handleClose();
      } else {
        alert(`❌ ${result.message || 'Erreur lors de la modification'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la modification de l\'enseignant');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      cin: '',
      telephone: '',
      grade: '',
      role: 'enseignant',
      departementId: '',
      specialiteEnseignementId: ''
    });
    setErrors({});
    onClose();
  };

  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier un enseignant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.prenom ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CIN *</label>
            <input
              type="text"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cin && <p className="text-red-500 text-xs mt-1">{errors.cin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un grade</option>
              <option value="Professeur">Professeur</option>
              <option value="Maître de conférences">Maître de conférences</option>
              <option value="Maître assistant">Maître assistant</option>
              <option value="Assistant">Assistant</option>
              <option value="Technologue">Technologue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="enseignant">Enseignant</option>
              <option value="directeur_departement">Directeur de Département</option>
            </select>
          </div>
        </div>

        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
            {loadingDepartments ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : (
              <select
                name="departementId"
                value={formData.departementId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.departementId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un département</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.nom}</option>
                ))}
              </select>
            )}
            {errors.departementId && <p className="text-red-500 text-xs mt-1">{errors.departementId}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécialité d'enseignement *
          </label>
          {loadingSpecialites ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
          ) : (
            <select
              name="specialiteEnseignementId"
              value={formData.specialiteEnseignementId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.specialiteEnseignementId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une spécialité</option>
              {specialitesEnseignement.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.nom}</option>
              ))}
            </select>
          )}
          {errors.specialiteEnseignementId && (
            <p className="text-red-500 text-xs mt-1">{errors.specialiteEnseignementId}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Modifier
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTeacherModal;
