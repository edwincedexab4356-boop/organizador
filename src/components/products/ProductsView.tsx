import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant } from '../../types';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
  Sparkles,
  ArrowUpDown,
  Tag,
  Package
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    config,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePublishProduct,
    toggleFeaturedProduct,
    currentUser,
    showToast
  } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    cost?: number;
    sku: string;
    categoryId: string;
    images: string[];
    stock: number;
    minStockAlert: number;
    isPublished: boolean;
    isFeatured: boolean;
    variants: ProductVariant[];
    tags: string[];
  }>({
    name: '',
    description: '',
    price: 0,
    comparePrice: 0,
    cost: 0,
    sku: '',
    categoryId: categories[0]?.id || '',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
    stock: 10,
    minStockAlert: 3,
    isPublished: true,
    isFeatured: false,
    variants: [],
    tags: []
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && p.isPublished) ||
      (selectedStatus === 'draft' && !p.isPublished) ||
      (selectedStatus === 'low_stock' && p.stock <= p.minStockAlert);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 150,
      comparePrice: 180,
      cost: 60,
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: categories[0]?.id || '',
      images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
      stock: 15,
      minStockAlert: 3,
      isPublished: true,
      isFeatured: false,
      variants: [],
      tags: ['Nuevo']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice || 0,
      cost: product.cost || 0,
      sku: product.sku,
      categoryId: product.categoryId,
      images: product.images.length > 0 ? [...product.images] : ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
      stock: product.stock,
      minStockAlert: product.minStockAlert,
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      variants: product.variants ? JSON.parse(JSON.stringify(product.variants)) : [],
      tags: product.tags ? [...product.tags] : []
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Por favor ingresa un nombre para el producto', 'error');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    } else {
      addProduct({
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteWithPermissionCheck = (id: string) => {
    if (currentUser.role !== 'admin') {
      showToast('Permiso denegado: Solo el Administrador puede eliminar productos', 'error');
      return;
    }
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  // Variant Helpers
  const addVariantOption = (variantIndex: number) => {
    const updated = [...formData.variants];
    const newId = `opt-${Date.now()}`;
    updated[variantIndex].options.push({
      id: newId,
      name: 'Nueva opción',
      priceDelta: 0,
      stock: 5
    });
    setFormData({ ...formData, variants: updated });
  };

  const addVariantGroup = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: 'Talla / Opción',
      options: [
        { id: `opt-${Date.now()}-1`, name: 'Estándar', priceDelta: 0, stock: 10 }
      ]
    };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
  };

  const removeVariantGroup = (index: number) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  // Image helpers
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Catálogo de Productos
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Administra precios, existencias, fotografías y variantes en un solo lugar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista en tabla"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista en cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar producto</span>
          </button>
        </div>
      </div>

      {/* Filters and search bar */}
      <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">Todas las categorías ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="low_stock">Stock bajo</option>
          </select>
        </div>
      </div>

      {/* Product Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-xl p-12 text-center">
          <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800">
            No se encontraron productos
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Intenta cambiar los filtros de búsqueda o agrega un nuevo producto al catálogo.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg"
          >
            Crear producto
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Modern Table View */
        <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Producto</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold">Precio</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Destacado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId);
                  const isLow = product.stock <= product.minStockAlert;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=80'}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-neutral-900 truncate max-w-xs">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              {product.sku}
                              {product.variants?.length > 0 && ` · ${product.variants.length} variante(s)`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neutral-700 font-medium">
                          {cat?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-neutral-900">
                          {config.currencySymbol}{product.price.toLocaleString()}
                        </div>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="text-[10px] text-neutral-400 line-through font-mono">
                            {config.currencySymbol}{product.comparePrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-semibold ${
                              product.stock === 0
                                ? 'text-red-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-neutral-900'
                            }`}
                          >
                            {product.stock} un.
                          </span>
                          {product.stock === 0 ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-semibold">
                              Agotado
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                              Bajo
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => togglePublishProduct(product.id)}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                            product.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {product.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Publicado
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Borrador
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleFeaturedProduct(product.id)}
                          className={`p-1 rounded-md transition-colors ${
                            product.isFeatured
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-neutral-300 hover:text-neutral-500'
                          }`}
                          title={product.isFeatured ? 'Quitar de destacados' : 'Marcar como destacado'}
                        >
                          <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                            title="Editar producto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar producto"
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
      ) : (
        /* Visual Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const cat = categories.find((c) => c.id === product.categoryId);
            const isLow = product.stock <= product.minStockAlert;
            return (
              <div
                key={product.id}
                className="bg-white border border-neutral-200/90 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-neutral-300 transition-all"
              >
                <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {product.isFeatured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Destacado
                    </span>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs ${
                      product.isPublished
                        ? 'bg-neutral-900/80 backdrop-blur-xs text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {product.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                      {cat?.name || 'Catálogo'}
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 mt-0.5 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-neutral-900 text-sm">
                        {config.currencySymbol}{product.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Stock: {product.stock} un.
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 text-center">
              ¿Eliminar este producto?
            </h3>
            <p className="text-xs text-neutral-500 text-center mt-1">
              Esta acción eliminará el producto del catálogo y no podrá deshacerse.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteWithPermissionCheck(deleteConfirmId)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Ingresa las características y revisa la vista previa en vivo a la derecha.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two columns (Form + Live Card Preview) */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Fields (7 cols) */}
              <form onSubmit={handleSaveProduct} id="product-form" className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Pizza Trufada al Carbón"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Descripción comercial
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe los ingredientes, materiales, corte o notas de sabor..."
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Precio ({config.currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Precio antes (tachado)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.comparePrice}
                      onChange={(e) => setFormData({ ...formData, comparePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Costo unitario
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      SKU / Código
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Stock disponible
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Alerta stock mínimo
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.minStockAlert}
                      onChange={(e) => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Multiple Images management */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Fotografías del producto (Múltiples imágenes)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      placeholder="URL de la imagen (o pega enlace)..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                    >
                      Añadir
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-neutral-200 overflow-hidden group">
                        <img
                          src={img}
                          alt="preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-red-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Variants management */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-800">
                      Variantes (Tallas, Colores, Opciones)
                    </span>
                    <button
                      type="button"
                      onClick={addVariantGroup}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Añadir variante
                    </button>
                  </div>

                  {formData.variants.map((v, vIdx) => (
                    <div key={v.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 mb-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[vIdx].name = e.target.value;
                            setFormData({ ...formData, variants: updated });
                          }}
                          placeholder="Nombre (ej. Talla)"
                          className="text-xs font-semibold bg-white px-2 py-1 border border-neutral-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariantGroup(vIdx)}
                          className="text-neutral-400 hover:text-red-600 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-1">
                        {v.options.map((opt, oIdx) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt.name}
                              onChange={(e) => {
                                const updated = [...formData.variants];
                                updated[vIdx].options[oIdx].name = e.target.value;
                                setFormData({ ...formData, variants: updated });
                              }}
                              placeholder="Opción (ej. M)"
                              className="text-xs bg-white px-2 py-1 border border-neutral-200 rounded flex-1"
                            />
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                              <span>+${config.currencySymbol}</span>
                              <input
                                type="number"
                                value={opt.priceDelta}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[vIdx].options[oIdx].priceDelta = Number(e.target.value);
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-16 text-xs bg-white px-1.5 py-1 border border-neutral-200 rounded font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addVariantOption(vIdx)}
                        className="text-[10px] text-neutral-600 hover:text-neutral-900 font-medium"
                      >
                        + Añadir valor
                      </button>
                    </div>
                  ))}
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded text-neutral-900 focus:ring-0"
                    />
                    <span className="text-xs font-medium text-neutral-700">Publicado en catálogo</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-neutral-900 focus:ring-0"
                    />
                    <span className="text-xs font-medium text-neutral-700">Destacar en portada</span>
                  </label>
                </div>
              </form>

              {/* Right Column: Real-time Live Product Preview (5 cols) */}
              <div className="lg:col-span-5 bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Vista Previa en Tienda
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                      En tiempo real
                    </span>
                  </div>

                  {/* Card mockup */}
                  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="aspect-4/3 bg-neutral-100 relative overflow-hidden">
                      <img
                        src={formData.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
                        alt="preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {formData.isFeatured && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" /> Destacado
                        </span>
                      )}
                      {!formData.isPublished && (
                        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                          Borrador (No visible a clientes)
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase">
                        {categories.find((c) => c.id === formData.categoryId)?.name || 'Categoría'}
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        {formData.name || 'Nombre del Producto'}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2">
                        {formData.description || 'Aquí aparecerá la descripción detallada de tu producto.'}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono font-bold text-base text-neutral-900">
                            {config.currencySymbol}{formData.price.toLocaleString()}
                          </span>
                          {formData.comparePrice && formData.comparePrice > formData.price ? (
                            <span className="font-mono text-xs text-neutral-400 line-through">
                              {config.currencySymbol}{formData.comparePrice.toLocaleString()}
                            </span>
                          ) : null}
                        </div>

                        <span className="text-[11px] font-medium text-emerald-600">
                          {formData.stock > 0 ? `${formData.stock} disponibles` : 'Agotado'}
                        </span>
                      </div>

                      {formData.variants.length > 0 && (
                        <div className="pt-2 border-t border-neutral-100">
                          <span className="text-[10px] text-neutral-400">Variantes disponibles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.variants[0]?.options.map((opt) => (
                              <span key={opt.id} className="text-[10px] px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 bg-neutral-50">
                                {opt.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-neutral-500 text-center">
                  Los cambios se reflejarán inmediatamente en el catálogo digital de Webora.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="product-form"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
              >
                {editingProduct ? 'Guardar Cambios' : 'Publicar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
