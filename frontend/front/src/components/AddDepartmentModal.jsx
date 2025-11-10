import React, { useState } from 'react';
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

const AddDepartmentModal = ({ isOpen, onClose, onDepartmentAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      newErrors.nom = 'Le nom du département est requis';
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
      // Import departementService
      const { departementService } = await import('../services/adminServices');
      
      console.log('Envoi des données département:', formData);
      await departementService.create(formData);
      
      alert('✅ Département ajouté avec succès!');
      
      // Reset form
      setFormData({
        nom: '',
        description: ''
      });
      
      // Notify parent component
      if (onDepartmentAdded) {
        onDepartmentAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du département:', error);
      alert('❌ Erreur lors de l\'ajout du département: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un Département">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du Département <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Informatique, Mathématiques, Physique..."
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optionnel)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Décrivez le département..."
          />
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
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDepartmentModal;
