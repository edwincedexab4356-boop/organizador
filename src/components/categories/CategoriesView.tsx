import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Image as ImageIcon,
  AlertCircle,
  X
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    currentUser,
    showToast
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: string;
    isPublished: boolean;
  }>({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
    isPublished: true
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
      isPublished: cat.isPublished
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    } else {
      addCategory({
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        order: categories.length + 1
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const productsInCat = products.filter((p) => p.categoryId === id);
    if (productsInCat.length > 0) {
      showToast(`No puedes eliminar una categoría con ${productsInCat.length} productos asociados. Reasígnalos primero.`, 'error');
      setDeleteConfirmId(null);
      return;
    }
    deleteCategory(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Categorías del Menú / Catálogo
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Organiza las secciones que tus clientes verán en la navegación principal.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva categoría</span>
        </button>
      </div>

      {/* Categories Table / List */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold w-16 text-center">Orden</th>
                <th className="py-3 px-4 font-semibold">Categoría</th>
                <th className="py-3 px-4 font-semibold">Descripción</th>
                <th className="py-3 px-4 font-semibold">Productos</th>
                <th className="py-3 px-4 font-semibold">Visibilidad</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat, index) => {
                const prodCount = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <tr key={cat.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Reordering Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => reorderCategory(cat.id, 'up')}
                          className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors"
                          title="Mover arriba"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === categories.length - 1}
                          onClick={() => reorderCategory(cat.id, 'down')}
                          className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 disabled:hover:text-neutral-400 transition-colors"
                          title="Mover abajo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image || 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=120&q=80'}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-neutral-900 text-sm">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            /{cat.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-neutral-600 max-w-sm truncate text-xs">
                        {cat.description || 'Sin descripción'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-neutral-900">
                        {prodCount} productos
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateCategory(cat.id, { isPublished: !cat.isPublished })}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                          cat.isPublished
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {cat.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Oculta
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 text-center">
              ¿Eliminar categoría?
            </h3>
            <p className="text-xs text-neutral-500 text-center mt-1">
              Esta categoría se eliminará del menú. Asegúrate de que no tenga productos activos asignados.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Postres Artesanales"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve texto visible bajo el título de la categoría..."
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  URL de Imagen de portada
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover rounded-lg mt-2 border border-neutral-200"
                  />
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-neutral-900 focus:ring-0"
                />
                <span className="text-xs font-medium text-neutral-700">
                  Visible en la tienda pública
                </span>
              </label>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                >
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
