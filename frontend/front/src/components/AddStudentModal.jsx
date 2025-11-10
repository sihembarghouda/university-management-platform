import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { classeService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    cin: '',
    classeId: ''
  });
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadClasses();
    }
  }, [isOpen]);

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await classeService.getAll();
      // L'API retourne un objet avec { value: [...] } au lieu d'un tableau directement
      setClasses(Array.isArray(data) ? data : (data.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      alert('Erreur lors du chargement des classes');
    } finally {
      setLoadingClasses(false);
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
    
    if (!formData.cin.trim()) {
      newErrors.cin = 'Le CIN est requis';
    } else if (formData.cin.length < 8) {
      newErrors.cin = 'Le CIN doit contenir au moins 8 caractères';
    }
    
    if (!formData.classeId) {
      newErrors.classeId = 'La classe est requise';
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
      // Import etudiantService
      const { etudiantService } = await import('../services/adminServices');
      
      const dataToSend = {
        ...formData,
        classeId: parseInt(formData.classeId)
      };
      
      console.log('Envoi des données:', dataToSend);
      await etudiantService.create(dataToSend);
      
      alert('✅ Étudiant ajouté avec succès!');
      
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        cin: '',
        classeId: ''
      });
      
      // Notify parent component
      if (onStudentAdded) {
        onStudentAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
      alert('❌ Erreur lors de l\'ajout de l\'étudiant: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un Étudiant">
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
            CIN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cin"
            value={formData.cin}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.cin ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Entrez le CIN (min 8 caractères)"
          />
          {errors.cin && <p className="text-red-500 text-sm mt-1">{errors.cin}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe <span className="text-red-500">*</span>
          </label>
          {loadingClasses ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="classeId"
              value={formData.classeId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.classeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom} - {classe.niveau?.nom || 'N/A'} - {classe.specialite?.nom || 'N/A'}
                </option>
              ))}
            </select>
          )}
          {errors.classeId && <p className="text-red-500 text-sm mt-1">{errors.classeId}</p>}
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
            disabled={loading || loadingClasses}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStudentModal;
