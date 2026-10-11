import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserAccount, UserRole } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Lock,
  Unlock,
  Check,
  X,
  Edit2,
  Trash2,
  UserCircle,
  KeyRound,
  Eye
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, currentUser, switchUserRole, addUser, updateUser, deleteUser, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    phone: '',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  const handleOpenAdd = () => {
    if (currentUser.role !== 'admin') {
      showToast('Permiso denegado: Solo el Administrador puede registrar usuarios', 'error');
      return;
    }
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      phone: '+52 ',
      active: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    if (currentUser.role !== 'admin') {
      showToast('Permiso denegado: Solo el Administrador puede editar usuarios', 'error');
      return;
    }
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      active: user.active,
      avatar: user.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  const permissionsMatrix = [
    { feature: 'Ver Dashboard y Métricas de Ventas', admin: true, employee: true, client: false },
    { feature: 'Gestionar y despachar Pedidos', admin: true, employee: true, client: false },
    { feature: 'Ajustar Inventario y existencias', admin: true, employee: true, client: false },
    { feature: 'Crear y editar Productos', admin: true, employee: true, client: false },
    { feature: 'Eliminar Productos del catálogo', admin: true, employee: false, client: false },
    { feature: 'Personalización de Marca y Colores', admin: true, employee: false, client: false },
    { feature: 'Editor de Apariencia del Sitio Web', admin: true, employee: false, client: false },
    { feature: 'Gestión de Usuarios y Permisos', admin: true, employee: false, client: false },
    { feature: 'Configuración Fiscal y Moneda', admin: true, employee: false, client: false },
    { feature: 'Consultar su propio Pedido en Tienda', admin: true, employee: true, client: true }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Usuarios, Roles y Control de Acceso (RBAC)
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Define privilegios jerárquicos para propietarios, cajeros, cocineros o repartidores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Role Switcher for live demos */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1 shadow-xs">
            <span className="text-[11px] text-neutral-500 font-medium pl-1 hidden sm:inline">
              Simular rol activo:
            </span>
            <button
              onClick={() => switchUserRole('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => switchUserRole('employee')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentUser.role === 'employee'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Cajero / Empleado
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo usuario</span>
          </button>
        </div>
      </div>

      {/* Role explanation banner */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900">
              Sesión activa actual: {currentUser.name} ({currentUser.role === 'admin' ? 'Administrador' : 'Empleado / Cajero'})
            </span>
            <p className="text-xs text-neutral-500 mt-0.5">
              {currentUser.role === 'admin'
                ? 'Tienes acceso total para modificar productos, apariencia, finanzas y configuración del negocio.'
                : 'Modo Cajero: Permisos limitados a pedidos e inventario; bloqueado para cambios de marca o eliminación.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => switchUserRole(currentUser.role === 'admin' ? 'employee' : 'admin')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
        >
          {currentUser.role === 'admin' ? 'Probar vista de Cajero' : 'Volver a modo Administrador'}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-sm font-bold text-neutral-900">
            Equipo del Negocio
          </h3>
          <p className="text-xs text-neutral-500">
            Cuentas habilitadas con credenciales de acceso al panel
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Usuario</th>
                <th className="py-3 px-4 font-semibold">Rol Asignado</th>
                <th className="py-3 px-4 font-semibold">Teléfono</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold">Fecha de Alta</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="font-semibold text-neutral-900 text-sm">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded ${
                        user.role === 'admin'
                          ? 'bg-neutral-900 text-white'
                          : user.role === 'employee'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {user.role === 'admin' ? 'Administrador' : 'Empleado / Cajero'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-600">
                    {user.phone || '—'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.active ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-400">
                    {user.createdAt}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                        title="Editar permisos"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-sm font-bold text-neutral-900">
            Matriz de Permisos por Rol
          </h3>
          <p className="text-xs text-neutral-500">
            Reglas de autorización aplicadas tanto en la interfaz como en el motor de datos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Módulo / Acción</th>
                <th className="py-2.5 px-4 font-semibold text-center">Administrador</th>
                <th className="py-2.5 px-4 font-semibold text-center">Empleado / Cajero</th>
                <th className="py-2.5 px-4 font-semibold text-center">Cliente (Tienda)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70">
                  <td className="py-2.5 px-4 font-medium text-neutral-800">
                    {item.feature}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.admin ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.employee ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.client ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingUser ? 'Editar Usuario y Permisos' : 'Registrar Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Roberto Sánchez"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Correo electrónico institucional *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="roberto@miempresa.com"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rol asignado
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg"
                  >
                    <option value="employee">Empleado / Cajero</option>
                    <option value="admin">Administrador (Acceso total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-neutral-900"
                />
                <span className="text-xs font-medium text-neutral-700">Usuario activo con acceso</span>
              </label>

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
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
