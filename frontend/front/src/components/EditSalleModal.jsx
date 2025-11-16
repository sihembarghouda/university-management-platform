import React, { useState, useEffect } from 'react';
import { salleService } from '../services/adminServices';

const EditSalleModal = ({ isOpen, onClose, initial, onSaved, departments = [] }) => {
  const [form, setForm] = useState({ code: '', nom: '', type: 'normale', capacite: 0, batiment: '', etage: '', equipements: '', departementId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        code: initial.code || '',
        nom: initial.nom || '',
        type: initial.type || 'normale',
        capacite: initial.capacite || 0,
        batiment: initial.batiment || '',
        etage: initial.etage || '',
        equipements: Array.isArray(initial.equipements) ? initial.equipements.join(',') : (initial.equipements || ''),
        departementId: initial.departement?.id || ''
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, equipements: form.equipements ? form.equipements.split(',').map(s => s.trim()) : [] };
    if (form.departementId) payload.departement = { id: Number(form.departementId) };
    const res = await salleService.update(initial.id, payload);
    setSaving(false);
    if (res.success) {
      onSaved(res.data);
      onClose();
    } else {
      alert('Erreur: ' + (res.message || 'Impossible de mettre à jour la salle'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">
        <h3 className="text-lg font-bold mb-4">Modifier la salle</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Code</label>
            <input name="code" value={form.code} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm">Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="normale">Normale</option>
                <option value="laboratoire">Laboratoire</option>
                <option value="amphitheatre">Amphithéâtre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Capacité</label>
              <input type="number" name="capacite" value={form.capacite} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Bâtiment</label>
              <input name="batiment" value={form.batiment} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Étage</label>
              <input name="etage" value={form.etage} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm">Équipements (séparés par des virgules)</label>
            <input name="equipements" value={form.equipements} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Département (optionnel)</label>
            <select name="departementId" value={form.departementId} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">Aucun</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalleModal;
