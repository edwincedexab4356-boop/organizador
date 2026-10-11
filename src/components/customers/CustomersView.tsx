import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Edit2,
  X,
  MessageCircle
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, config, addCustomer, updateCustomer, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email ? c.email.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '+52 ', email: '', address: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  // Open direct WhatsApp chat with customer
  const handleOpenWhatsAppChat = (phone: string, name: string) => {
    const raw = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hola ${name}, te contactamos desde ${config.name}. ¿Cómo podemos ayudarte hoy?`);
    window.open(`https://wa.me/${raw}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Directorio de Clientes
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Base de datos unificada con historial de pedidos y valor de vida del cliente (LTV).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo cliente</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre, teléfono o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          Total: {customers.length} clientes registrados
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Cliente</th>
                <th className="py-3 px-4 font-semibold">Contacto</th>
                <th className="py-3 px-4 font-semibold">Dirección</th>
                <th className="py-3 px-4 font-semibold text-center">Pedidos</th>
                <th className="py-3 px-4 font-semibold">Total Comprado</th>
                <th className="py-3 px-4 font-semibold">Último Pedido</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.map((cust) => {
                const customerOrders = orders.filter(
                  (o) => o.customer.phone === cust.phone || o.customer.email === cust.email
                );
                return (
                  <tr key={cust.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 text-sm">
                        {cust.name}
                      </div>
                      {cust.notes && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5 max-w-xs truncate">
                          {cust.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-600">
                      <div>{cust.phone}</div>
                      <div className="text-[10px] text-neutral-400 font-sans">{cust.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                      {cust.address || 'Sin dirección registrada'}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-900">
                      {cust.totalOrders}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {config.currencySymbol}{cust.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                      {cust.lastOrderDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenWhatsAppChat(cust.phone, cust.name)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Enviar mensaje de WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Sofía Mendoza"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teléfono celular *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dirección predeterminada
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, número, colonia, código postal"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Notas del cliente (preferencias o restricciones)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej. Alérgico a nueces, cliente VIP..."
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100">
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
                  {editingCustomer ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
