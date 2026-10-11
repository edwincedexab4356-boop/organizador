import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreConfig } from '../../types';
import {
  Palette,
  Image as ImageIcon,
  Phone,
  Clock,
  MessageCircle,
  HelpCircle,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
  MapPin,
  Share2,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';

export const StoreCustomizationView: React.FC = () => {
  const { config, updateConfig, setIsPublicSiteOpen, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'schedules' | 'whatsapp' | 'policies'>('branding');
  const [formData, setFormData] = useState<StoreConfig>({ ...config });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleFieldChange = (key: keyof StoreConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleOpeningHourChange = (day: string, field: 'open' | 'close' | 'isOpen', value: any) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAndPublish = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setHasUnsavedChanges(false);
    showToast('¡Configuración de tienda guardada y publicada!', 'success');
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: 'Nueva pregunta frecuente', answer: 'Respuesta detallada...' }]
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Personalización Comercial de la Tienda
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configura la identidad de marca, logotipos, horarios, WhatsApp y políticas del negocio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPublicSiteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Previsualizar tienda</span>
          </button>
          <button
            onClick={handleSaveAndPublish}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar y publicar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-1 p-2 border-b border-neutral-200 overflow-x-auto bg-neutral-50/50">
          {[
            { id: 'branding', label: 'Marca & Apariencia', icon: Palette },
            { id: 'contact', label: 'Contacto & Ubicación', icon: Phone },
            { id: 'schedules', label: 'Horarios de Atención', icon: Clock },
            { id: 'whatsapp', label: 'Botón de WhatsApp', icon: MessageCircle },
            { id: 'policies', label: 'Políticas & FAQs', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* TAB 1: BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nombre comercial del negocio *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Slogan o subtítulo breve
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleFieldChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Descripción comercial completa
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    URL del Logotipo
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleFieldChange('logo', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                  {formData.logo && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                      <img
                        src={formData.logo}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <span className="text-[11px] text-neutral-500">Vista previa del logo</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    URL Imagen Principal de Portada
                  </label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => handleFieldChange('heroImage', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="text-xs font-bold text-neutral-900">
                  Colores de Marca
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Color de Fondo Primario
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="w-9 h-9 p-0.5 rounded cursor-pointer border border-neutral-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="w-28 px-2 py-1 text-xs font-mono border border-neutral-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Color de Acento / Botones
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="w-9 h-9 p-0.5 rounded cursor-pointer border border-neutral-300"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="w-28 px-2 py-1 text-xs font-mono border border-neutral-200 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner promocional */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Barra de Anuncio / Promoción Superior
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bannerActive}
                      onChange={(e) => handleFieldChange('bannerActive', e.target.checked)}
                      className="rounded text-neutral-900"
                    />
                    <span className="text-xs text-neutral-600">Mostrar barra</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.bannerText}
                  onChange={(e) => handleFieldChange('bannerText', e.target.value)}
                  placeholder="Ej. 🔥 15% de descuento en pedidos hoy..."
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teléfono fijo o celular
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dirección física del establecimiento
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Enlace a Google Maps
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleFieldChange('googleMapsUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-800 mb-2 block">
                  Redes Sociales
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={formData.socials?.instagram || ''}
                      onChange={(e) =>
                        handleFieldChange('socials', { ...formData.socials, instagram: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={formData.socials?.facebook || ''}
                      onChange={(e) =>
                        handleFieldChange('socials', { ...formData.socials, facebook: e.target.value })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">TikTok</label>
                    <input
                      type="url"
                      value={formData.socials?.tiktok || ''}
                      onChange={(e) =>
                        handleFieldChange('socials', { ...formData.socials, tiktok: e.target.value })
                      }
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs text-neutral-500">
                Define las horas de apertura para que tus clientes sepan cuándo recibir pedidos en tiempo real.
              </p>

              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {daysOfWeek.map((day) => {
                  const schedule = formData.openingHours[day.key] || {
                    open: '09:00',
                    close: '20:00',
                    isOpen: true
                  };
                  return (
                    <div
                      key={day.key}
                      className="p-3 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 w-32">
                        <input
                          type="checkbox"
                          checked={schedule.isOpen}
                          onChange={(e) =>
                            handleOpeningHourChange(day.key, 'isOpen', e.target.checked)
                          }
                          className="rounded text-neutral-900"
                        />
                        <span className={`font-semibold ${schedule.isOpen ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {day.label}
                        </span>
                      </div>

                      {schedule.isOpen ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={schedule.open}
                            onChange={(e) =>
                              handleOpeningHourChange(day.key, 'open', e.target.value)
                            }
                            className="px-2 py-1 border border-neutral-200 rounded text-xs font-mono"
                          />
                          <span className="text-neutral-400">a</span>
                          <input
                            type="time"
                            value={schedule.close}
                            onChange={(e) =>
                              handleOpeningHourChange(day.key, 'close', e.target.value)
                            }
                            className="px-2 py-1 border border-neutral-200 rounded text-xs font-mono"
                          />
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Cerrado todo el día</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Venta Conversacional por WhatsApp:</span>
                  <p className="mt-0.5 text-emerald-800">
                    Tus clientes podrán armar su pedido en el catálogo y enviarlo directamente a este número con un solo clic, incluyendo resumen y dirección de entrega.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Número de WhatsApp para pedidos (con código de país) *
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mensaje inicial predeterminado
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsappOrderMessage}
                  onChange={(e) => handleFieldChange('whatsappOrderMessage', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: POLICIES & FAQS */}
          {activeTab === 'policies' && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-700">
                  Política de Entrega / Despacho
                </label>
                <textarea
                  rows={2}
                  value={formData.policies.shipping}
                  onChange={(e) =>
                    handleFieldChange('policies', {
                      ...formData.policies,
                      shipping: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-700">
                  Garantía y Devoluciones
                </label>
                <textarea
                  rows={2}
                  value={formData.policies.returns}
                  onChange={(e) =>
                    handleFieldChange('policies', {
                      ...formData.policies,
                      returns: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-900">
                    Preguntas Frecuentes (FAQs)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar pregunta
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const copy = [...formData.faqs];
                            copy[idx].question = e.target.value;
                            setFormData({ ...formData, faqs: copy });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full font-semibold text-xs bg-white px-2 py-1 border border-neutral-200 rounded mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-neutral-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const copy = [...formData.faqs];
                          copy[idx].answer = e.target.value;
                          setFormData({ ...formData, faqs: copy });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full text-xs bg-white px-2 py-1 border border-neutral-200 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
