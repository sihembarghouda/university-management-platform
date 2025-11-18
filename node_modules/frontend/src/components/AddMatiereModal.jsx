import React, { useState, useEffect } from 'react';
import { matiereService } from '../services/adminServices';

const AddMatiereModal = ({ isOpen, onClose, onSaved, departments = [], specialites = [], niveaux = [], classes = [], teachers = [] }) => {
  const [form, setForm] = useState({ nom: '', code: '', departementId: '', specialiteId: '', niveauId: '', classeId: '', enseignantsIds: [], description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) setForm({ nom: '', code: '', departementId: '', specialiteId: '', niveauId: '', classeId: '', enseignantsIds: [], description: '' });
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTeachersChange = (e) => {
    const opts = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setForm(prev => ({ ...prev, enseignantsIds: opts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nom: form.nom,
      code: form.code,
      departement: form.departementId ? { id: Number(form.departementId) } : undefined,
      specialite: form.specialiteId ? { id: Number(form.specialiteId) } : undefined,
      niveau: form.niveauId ? { id: Number(form.niveauId) } : undefined,
      classe: form.classeId ? { id: Number(form.classeId) } : undefined,
      enseignants: form.enseignantsIds.map(id => ({ id })),
      description: form.description
    };

    const res = await matiereService.create(payload);
    setSaving(false);
    if (res.success) {
      onSaved(res.data);
      onClose();
    } else {
      alert('Erreur: ' + (res.message || 'Impossible de créer la matière'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 p-6">
        <h3 className="text-lg font-bold mb-4">Ajouter une matière</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm">Code</label>
            <input name="code" value={form.code} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Département</label>
              <select name="departementId" value={form.departementId} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Choisir</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Spécialité</label>
              <select name="specialiteId" value={form.specialiteId} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Choisir</option>
                {specialites.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Niveau</label>
              <select name="niveauId" value={form.niveauId} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Choisir</option>
                {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Classe</label>
              <select name="classeId" value={form.classeId} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Choisir</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm">Enseignants (Ctrl/Cmd+click pour multiple)</label>
            <select multiple value={form.enseignantsIds.map(String)} onChange={handleTeachersChange} className="w-full border p-2 rounded h-28">
              {teachers.map(t => <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Enregistrement...' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMatiereModal;
