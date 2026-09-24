'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Feedback
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  };

  // GET: Cargar items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Error de conexión al cargar elementos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // POST: Crear item
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();

      if (data.success) {
        setTitle('');
        setDescription('');
        showMessage('¡Elemento guardado con éxito!');
        fetchItems();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Error al enviar los datos', 'error');
    }
  };

  // PUT: Actualizar item
  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      const data = await res.json();

      if (data.success) {
        setEditingId(null);
        showMessage('Elemento actualizado correctamente');
        fetchItems();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Error al actualizar el elemento', 'error');
    }
  };

  // DELETE: Eliminar item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        showMessage('Elemento eliminado');
        fetchItems();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Error al eliminar el elemento', 'error');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-slate-100">Día 36: App CRUD con Next.js & MongoDB</h1>
        <p className="text-slate-400 mt-1">Gestión de items persistentes en MongoDB Atlas</p>
      </header>

      {/* Mensajes de feedback */}
      {message.text && (
        <div
          className={`p-4 rounded-lg text-sm border ${message.type === 'error'
              ? 'bg-rose-950 border-rose-800 text-rose-300'
              : 'bg-emerald-950 border-emerald-800 text-emerald-300'
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Formulario de Creación */}
      <form onSubmit={handleCreate} className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">Añadir Nuevo Elemento</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Título (obligatorio)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100"
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
        >
          Guardar
        </button>
      </form>

      {/* Listado de Items */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Lista de Elementos</h2>

        {loading ? (
          <p className="text-cyan-400 font-mono animate-pulse">Cargando elementos desde MongoDB...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500">No hay elementos registrados en la base de datos.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                {editingId === item._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1 bg-slate-800 border border-cyan-500 rounded text-slate-100"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-slate-100">{item.title}</h3>
                    {item.description && <p className="text-sm text-slate-400">{item.description}</p>}
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === item._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-500"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(item._id);
                          setEditTitle(item.title);
                          setEditDescription(item.description || '');
                        }}
                        className="px-3 py-1 bg-slate-800 text-amber-400 border border-amber-500/30 text-sm rounded hover:bg-amber-950"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-slate-800 text-rose-400 border border-rose-500/30 text-sm rounded hover:bg-rose-950"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}