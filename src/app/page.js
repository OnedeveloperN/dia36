'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar ítems');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('El título no puede estar vacío');
      return;
    }

    try {
      setSubmitting(true);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/items/${editingId}` : '/api/items';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error');

      setSuccess(editingId ? '¡Ítem actualizado!' : '¡Ítem creado exitosamente!');
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description || '');
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este ítem?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');

      setSuccess('Ítem eliminado correctamente');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Encabezado */}
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Día 36: App CRUD con Next.js & MongoDB
        </h1>
        <p className="text-indigo-600 font-medium text-sm mt-1">
          Gestión de items persistentes en MongoDB Atlas
        </p>
      </header>

      {/* Alertas */}
      {error && <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-medium">{error}</div>}
      {success && <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium">{success}</div>}

      {/* Formulario con Fondo Blanco Forzado */}
      <form
        onSubmit={handleSubmit}
        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        className="p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4"
      >
        <h2 className="text-lg font-bold text-slate-900">
          {editingId ? 'Editar Elemento' : 'Añadir Nuevo Elemento'}
        </h2>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            className="w-full px-3.5 py-2.5 border border-slate-300 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Título (obligatorio)"
          />
        </div>

        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            className="w-full px-3.5 py-2.5 border border-slate-300 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Descripción (opcional)"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
            className="font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ backgroundColor: '#f1f5f9', color: '#334155' }}
              className="font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de Elementos */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Lista de Elementos</h2>

        {loading ? (
          <p className="text-slate-500 text-sm">Cargando elementos...</p>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay elementos registrados en la base de datos.</p>
        ) : (
          <div className="space-y-3">
            {Array.isArray(items) && items.map((item) => (
              <div
                key={item._id}
                style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                className="p-4 rounded-xl border border-slate-300 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  {item.description && <p className="text-sm text-slate-600 mt-0.5">{item.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-indigo-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{ backgroundColor: '#ffe4e6', color: '#9f1239' }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-rose-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}