'use client';
import { useState } from 'react';
import { useShared } from '@/context/SharedContext';
import { Inspector } from '@/types';
import { Plus, Phone, Mail, Edit2, Trash2, X, Check } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';

type FormData = Omit<Inspector, 'id' | 'assignedBookingIds'>;

const emptyForm: FormData = { name: '', phone: '', email: '', isActive: true };

export default function InspectorsPage() {
  const { inspectors, addInspector, updateInspector, deleteInspector, bookings } = useShared();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (i: Inspector) => { setForm({ name: i.name, phone: i.phone, email: i.email, isActive: i.isActive }); setEditId(i.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    if (editId) updateInspector(editId, form);
    else addInspector({ ...form, assignedBookingIds: [] });
    setShowForm(false);
  };

  const getActiveCount = (inspectorId: string) =>
    bookings.filter((b) => b.inspectorId === inspectorId &&
      b.status !== 'completed' && b.status !== 'inspection_failed' && b.status !== 'test_failed'
    ).length;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">בוחנים</h1>
          <p className="text-gray-500 text-sm">{inspectors.length} בוחנים רשומים</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark"
        >
          <Plus size={18} />
          הוסף בוחן
        </button>
      </div>

      <div className="space-y-3">
        {inspectors.map((inspector) => {
          const activeCount = getActiveCount(inspector.id);
          return (
            <div key={inspector.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {inspector.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{inspector.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inspector.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {inspector.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                    {activeCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                        {activeCount} הזמנות פעילות
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Phone size={13} />{inspector.phone}</div>
                    <div className="flex items-center gap-1"><Mail size={13} />{inspector.email}</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(inspector)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                    <Edit2 size={14} className="text-gray-500" />
                  </button>
                  <button onClick={() => setDeleteId(inspector.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100">
                    <Trash2 size={14} className="text-error" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editId ? 'ערוך בוחן' : 'הוסף בוחן'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="שם מלא *" className="w-full border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="טלפון *" className="w-full border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30" dir="ltr" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" className="w-full border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30" dir="ltr" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-700">פעיל</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">ביטול</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-1 hover:bg-primary-dark">
                <Check size={16} />
                שמור
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="מחיקת בוחן"
        message="האם למחוק את הבוחן? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        onConfirm={() => { if (deleteId) deleteInspector(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
