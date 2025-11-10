import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { niveauService, specialiteService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const AddClasseModal = ({ isOpen, onClose, onClasseAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    niveauId: '',
    specialiteId: ''
  });
  
  const [niveaux, setNiveaux] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [niveauxData, specialitesData] = await Promise.all([
        niveauService.getAll(),
        specialiteService.getAll()
      ]);
      // L'API retourne soit un tableau, soit { value: [...] }
      setNiveaux(Array.isArray(niveauxData) ? niveauxData : (niveauxData.value || []));
      setSpecialites(Array.isArray(specialitesData) ? specialitesData : (specialitesData.value || []));
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de la classe est requis';
    }
    
    if (!formData.niveauId) {
      newErrors.niveauId = 'Le niveau est requis';
    }
    
    if (!formData.specialiteId) {
      newErrors.specialiteId = 'La spécialité est requise';
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
      // Import classeService
      const { classeService } = await import('../services/adminServices');
      
      const dataToSend = {
        ...formData,
        niveauId: parseInt(formData.niveauId),
        specialiteId: parseInt(formData.specialiteId)
      };
      
      console.log('Envoi des données classe:', dataToSend);
      await classeService.create(dataToSend);
      
      alert('✅ Classe ajoutée avec succès!');
      
      // Reset form
      setFormData({
        nom: '',
        niveauId: '',
        specialiteId: ''
      });
      
      // Notify parent component
      if (onClasseAdded) {
        onClasseAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la classe:', error);
      alert('❌ Erreur lors de l\'ajout de la classe: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une Classe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la Classe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: L1-INFO-A, M2-MATH-B..."
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau <span className="text-red-500">*</span>
          </label>
          {loadingData ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="niveauId"
              value={formData.niveauId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.niveauId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un niveau</option>
              {niveaux.map(niveau => (
                <option key={niveau.id} value={niveau.id}>
                  {niveau.nom}
                </option>
              ))}
            </select>
          )}
          {errors.niveauId && <p className="text-red-500 text-sm mt-1">{errors.niveauId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité <span className="text-red-500">*</span>
          </label>
          {loadingData ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <select
              name="specialiteId"
              value={formData.specialiteId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.specialiteId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez une spécialité</option>
              {specialites.map(spec => (
                <option key={spec.id} value={spec.id}>
                  {spec.nom}
                </option>
              ))}
            </select>
          )}
          {errors.specialiteId && <p className="text-red-500 text-sm mt-1">{errors.specialiteId}</p>}
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

export default AddClasseModal;
