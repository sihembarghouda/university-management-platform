import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { departementService, specialiteEnseignementService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const AddTeacherModal = ({ isOpen, onClose, onTeacherAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    grade: '',
    departementId: '',
    specialiteEnseignementId: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [specialitesEnseignement, setSpecialitesEnseignement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const grades = ['Assistant', 'Maître Assistant', 'Maître de Conférences', 'Professeur'];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [deptData, specEnsData] = await Promise.all([
        departementService.getAll(),
        specialiteEnseignementService.getAll()
      ]);
      // L'API retourne un objet avec { value: [...] } au lieu d'un tableau directement
      setDepartments(Array.isArray(deptData) ? deptData : (deptData.value || []));
      setSpecialitesEnseignement(Array.isArray(specEnsData) ? specEnsData : (specEnsData.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelect = (e, fieldName) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedValues
    }));
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'Le grade est requis';
    }
    
    if (!formData.departementId) {
      newErrors.departementId = 'Le département est requis';
    }
    
    if (!formData.specialiteEnseignementId) {
      newErrors.specialiteEnseignementId = 'La spécialité d\'enseignement est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Import enseignantService
      const { enseignantService } = await import('../services/adminServices');
      
      const dataToSend = {
        ...formData,
        departementId: parseInt(formData.departementId),
        specialiteEnseignementId: parseInt(formData.specialiteEnseignementId)
      };
      
      console.log('Envoi des données:', dataToSend);
      await enseignantService.create(dataToSend);
      
      alert('✅ Enseignant ajouté avec succès!');
      
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        grade: '',
        departementId: '',
        specialiteEnseignementId: ''
      });
      
      // Notify parent component
      if (onTeacherAdded) {
        onTeacherAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'enseignant:', error);
      alert('❌ Erreur lors de l\'ajout de l\'enseignant: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un Enseignant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Entrez le nom"
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.prenom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Entrez le prénom"
          />
          {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="exemple@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade <span className="text-red-500">*</span>
          </label>
          {loadingData ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.grade ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          )}
          {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Département <span className="text-red-500">*</span>
          </label>
          {loadingData ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="departementId"
              value={formData.departementId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.departementId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un département</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          )}
          {errors.departementId && <p className="text-red-500 text-sm mt-1">{errors.departementId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité d'Enseignement <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(Matière enseignée)</span>
          </label>
          {loadingData ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="specialiteEnseignementId"
              value={formData.specialiteEnseignementId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.specialiteEnseignementId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez une spécialité d'enseignement</option>
              {/* Group by domaine */}
              {[...new Set(specialitesEnseignement.map(s => s.domaine))].map(domaine => (
                <optgroup key={domaine} label={domaine || 'Autre'}>
                  {specialitesEnseignement
                    .filter(s => s.domaine === domaine)
                    .map(spec => (
                      <option key={spec.id} value={spec.id}>
                        {spec.nom}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          )}
          {errors.specialiteEnseignementId && <p className="text-red-500 text-sm mt-1">{errors.specialiteEnseignementId}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-200 flex items-center gap-2"
            disabled={loading || loadingData}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTeacherModal;
