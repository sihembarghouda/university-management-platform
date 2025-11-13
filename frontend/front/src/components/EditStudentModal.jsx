import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { classeService, etudiantService } from '../services/adminServices';
import { Loader2 } from 'lucide-react';

const EditStudentModal = ({ isOpen, onClose, onStudentUpdated, student }) => {
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

  // Charger les données de l'étudiant
  useEffect(() => {
    if (isOpen && student) {
      setFormData({
        nom: student.nom || '',
        prenom: student.prenom || '',
        email: student.email || '',
        cin: student.cin || '',
        classeId: student.classeId || student.classe?.id || ''
      });
      loadClasses();
    }
  }, [isOpen, student]);

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await classeService.getAll();
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
    if (!formData.classeId) newErrors.classeId = 'La classe est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await etudiantService.update(student.id, formData);
      
      if (result.success) {
        alert('✅ Étudiant modifié avec succès!');
        onStudentUpdated();
        handleClose();
      } else {
        alert(`❌ ${result.message || 'Erreur lors de la modification'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la modification de l\'étudiant');
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
      classeId: ''
    });
    setErrors({});
    onClose();
  };

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier un étudiant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CIN *
            </label>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe *
          </label>
          {loadingClasses ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
          ) : (
            <select
              name="classeId"
              value={formData.classeId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.classeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          )}
          {errors.classeId && <p className="text-red-500 text-xs mt-1">{errors.classeId}</p>}
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

export default EditStudentModal;
