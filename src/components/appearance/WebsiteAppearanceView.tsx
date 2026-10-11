import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WebsiteLayoutConfig, HeroStyle } from '../../types';
import {
  Eye,
  Layout,
  Sliders,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  AlertCircle,
  X
} from 'lucide-react';

export const WebsiteAppearanceView: React.FC = () => {
  const { layout, config, categories, products, saveAndPublishAppearance, showToast } = useStore();

  // Local editable draft state
  const [draftLayout, setDraftLayout] = useState<WebsiteLayoutConfig>({ ...layout });
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);

  const handleUpdate = (field: keyof WebsiteLayoutConfig, value: any) => {
    setDraftLayout((prev) => ({ ...prev, [field]: value }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...draftLayout.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    handleUpdate('sectionOrder', list);
  };

  const handlePublishConfirm = () => {
    saveAndPublishAppearance(draftLayout);
    setIsConfirmPublishOpen(false);
  };

  const sectionLabels: Record<string, string> = {
    banner: 'Barra de Promoción Superior',
    hero: 'Portada Principal / Encabezado',
    categories: 'Carrusel de Categorías',
    featured: 'Productos Destacados',
    about: 'Historia y Sobre Nosotros',
    reviews: 'Opiniones y Reseñas de Clientes',
    faq: 'Preguntas Frecuentes'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Editor Visual de Apariencia del Sitio Web
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Personaliza la portada, estructura de secciones y titulares con vista previa en vivo a la derecha.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device switch */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                previewDevice === 'desktop' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista de escritorio"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                previewDevice === 'mobile' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Vista móvil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsConfirmPublishOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publicar cambios</span>
          </button>
        </div>
      </div>

      {/* Split layout: Left Editor (5 cols) | Right Live Device Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs space-y-6">
          {/* Hero Style Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 mb-2">
              Estilo de Portada Principal (Hero)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'showcase', label: 'Showcase', desc: 'Centrado' },
                { id: 'split', label: 'Split 2-Col', desc: 'Texto + Imagen' },
                { id: 'minimal', label: 'Minimal', desc: 'Sobrio' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleUpdate('heroStyle', style.id as HeroStyle)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    draftLayout.heroStyle === style.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="text-xs">{style.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Texts & Call to Action */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <div className="text-xs font-bold text-neutral-900">
              Textos de la Portada
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Titular principal (Headline)
              </label>
              <input
                type="text"
                value={draftLayout.heroHeadline}
                onChange={(e) => handleUpdate('heroHeadline', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Subtítulo de portada
              </label>
              <textarea
                rows={2}
                value={draftLayout.heroSubheadline}
                onChange={(e) => handleUpdate('heroSubheadline', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Texto del botón de acción (CTA)
              </label>
              <input
                type="text"
                value={draftLayout.ctaText}
                onChange={(e) => handleUpdate('ctaText', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Section Visibility & Ordering */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Orden y Visibilidad de Secciones
              </span>
              <span className="text-[10px] text-neutral-400">Reordena con flechas</span>
            </div>

            <div className="space-y-1.5">
              {draftLayout.sectionOrder.map((secKey, idx) => (
                <div
                  key={secKey}
                  className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-200 text-xs"
                >
                  <span className="font-medium text-neutral-800">
                    {sectionLabels[secKey] || secKey}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === draftLayout.sectionOrder.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-neutral-100">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Texto del pie de página (Footer)
            </label>
            <input
              type="text"
              value={draftLayout.footerNote}
              onChange={(e) => handleUpdate('footerNote', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Live Interactive Device Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full mb-2 flex items-center justify-between px-2 text-xs text-neutral-400">
            <span>Previsualización en tiempo real</span>
            <span className="capitalize">{previewDevice === 'desktop' ? 'Modo Pantalla Completa' : 'Modo Celular'}</span>
          </div>

          <div
            className={`w-full bg-white border border-neutral-300 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
            }`}
          >
            {/* Browser top chrome */}
            <div className="h-8 bg-neutral-100 border-b border-neutral-200 px-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 text-[10px] text-neutral-400 font-mono">
                https://{config.slug}.webora.app
              </span>
            </div>

            {/* Mockup Canvas */}
            <div className="max-h-[600px] overflow-y-auto bg-neutral-50 text-neutral-900 text-xs">
              {/* Promotional Banner */}
              {config.bannerActive && (
                <div className="bg-neutral-900 text-white text-[10px] text-center py-1.5 px-3 font-medium">
                  {config.bannerText}
                </div>
              )}

              {/* Mini Nav */}
              <div className="bg-white px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={config.logo}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover"
                  />
                  <span className="font-bold text-neutral-900 text-xs tracking-tight">
                    {config.name}
                  </span>
                </div>
                <button className="bg-neutral-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded">
                  Ordenar
                </button>
              </div>

              {/* Hero based on chosen style */}
              {draftLayout.heroStyle === 'showcase' ? (
                <div className="relative py-12 px-6 text-center bg-neutral-900 text-white overflow-hidden">
                  <div className="relative z-10 max-w-md mx-auto space-y-3">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {config.tagline}
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {draftLayout.heroHeadline}
                    </h3>
                    <p className="text-xs text-neutral-300">
                      {draftLayout.heroSubheadline}
                    </p>
                    <button className="bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
                      {draftLayout.ctaText}
                    </button>
                  </div>
                </div>
              ) : draftLayout.heroStyle === 'split' ? (
                <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase">
                      {config.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      {draftLayout.heroHeadline}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {draftLayout.heroSubheadline}
                    </p>
                    <button className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {draftLayout.ctaText}
                    </button>
                  </div>
                  <img
                    src={config.heroImage}
                    alt="Hero"
                    referrerPolicy="no-referrer"
                    className="rounded-xl h-36 w-full object-cover"
                  />
                </div>
              ) : (
                /* Minimal */
                <div className="py-8 px-6 bg-white border-b border-neutral-100 text-center space-y-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    {draftLayout.heroHeadline}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {draftLayout.heroSubheadline}
                  </p>
                  <button className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded">
                    {draftLayout.ctaText}
                  </button>
                </div>
              )}

              {/* Mock Categories Carousel */}
              <div className="p-4 bg-white border-b border-neutral-100">
                <div className="text-[11px] font-bold text-neutral-400 uppercase mb-2">
                  Categorías
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="px-2.5 py-1 bg-neutral-100 rounded-md text-[11px] font-medium text-neutral-700 shrink-0"
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Products Grid */}
              <div className="p-4 bg-neutral-50">
                <div className="text-[11px] font-bold text-neutral-400 uppercase mb-3">
                  Productos Destacados
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.slice(0, 2).map((p) => (
                    <div key={p.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-20 w-full object-cover"
                      />
                      <div className="p-2 space-y-1">
                        <div className="font-semibold text-neutral-900 text-[11px] truncate">{p.name}</div>
                        <div className="font-mono font-bold text-xs">{config.currencySymbol}{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                {draftLayout.footerNote}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Publishing (Prompt requirement: "No permitir que los cambios se publiquen sin confirmación") */}
      {isConfirmPublishOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 text-center">
              ¿Confirmar y publicar apariencia?
            </h3>
            <p className="text-xs text-neutral-500 text-center mt-1">
              Los cambios en la portada, orden de secciones y titulares se aplicarán inmediatamente en la tienda web pública.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setIsConfirmPublishOpen(false)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Seguir editando
              </button>
              <button
                onClick={handlePublishConfirm}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Sí, publicar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
