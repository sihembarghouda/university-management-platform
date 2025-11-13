import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { classeService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const EditClasseModal = ({ isOpen, onClose, onClasseUpdated, classe }) => {
  const [formData, setFormData] = useState({
    niveauId: '',
    specialiteId: ''
  });
  
  const [niveaux, setNiveaux] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNiveaux, setLoadingNiveaux] = useState(true);
  const [loadingSpecialites, setLoadingSpecialites] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && classe) {
      setFormData({
        niveauId: classe.niveauId || '',
        specialiteId: classe.specialiteId || ''
      });
      loadNiveaux();
      loadSpecialites();
    }
  }, [isOpen, classe]);

  const loadNiveaux = async () => {
    try {
      setLoadingNiveaux(true);
      const response = await fetch('http://localhost:3000/niveau');
      const data = await response.json();
      setNiveaux(Array.isArray(data) ? data : (data.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des niveaux:', error);
    } finally {
      setLoadingNiveaux(false);
    }
  };

  const loadSpecialites = async () => {
    try {
      setLoadingSpecialites(true);
      const response = await fetch('http://localhost:3000/specialite');
      const data = await response.json();
      setSpecialites(Array.isArray(data) ? data : (data.value || []));
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error);
    } finally {
      setLoadingSpecialites(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.niveauId) newErrors.niveauId = 'Le niveau est requis';
    if (!formData.specialiteId) newErrors.specialiteId = 'La spécialité est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await classeService.update(classe.id, formData);
      
      if (result.success) {
        alert('✅ Classe modifiée avec succès!');
        onClasseUpdated();
        handleClose();
      } else {
        alert(`❌ ${result.message || 'Erreur lors de la modification'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la modification de la classe');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      niveauId: '',
      specialiteId: ''
    });
    setErrors({});
    onClose();
  };

  if (!classe) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier une classe">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau *
          </label>
          {loadingNiveaux ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
          ) : (
            <select
              name="niveauId"
              value={formData.niveauId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.niveauId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un niveau</option>
              {niveaux.map(niveau => (
                <option key={niveau.id} value={niveau.id}>
                  {niveau.nom}
                </option>
              ))}
            </select>
          )}
          {errors.niveauId && <p className="text-red-500 text-xs mt-1">{errors.niveauId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité *
          </label>
          {loadingSpecialites ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
          ) : (
            <select
              name="specialiteId"
              value={formData.specialiteId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.specialiteId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une spécialité</option>
              {specialites.map(spec => (
                <option key={spec.id} value={spec.id}>
                  {spec.nom}
                </option>
              ))}
            </select>
          )}
          {errors.specialiteId && <p className="text-red-500 text-xs mt-1">{errors.specialiteId}</p>}
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

export default EditClasseModal;
