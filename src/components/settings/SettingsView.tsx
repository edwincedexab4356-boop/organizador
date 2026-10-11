import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Settings,
  DollarSign,
  Printer,
  MessageSquare,
  Database,
  Save,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetDemoData, showToast } = useStore();

  const [currency, setCurrency] = useState(config.currency);
  const [currencySymbol, setCurrencySymbol] = useState(config.currencySymbol);
  const [taxRate, setTaxRate] = useState(config.taxRate);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      currency,
      currencySymbol,
      taxRate
    });
    showToast('Ajustes fiscales y de moneda actualizados', 'success');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      config,
      exportedFrom: 'Webora Admin Suite v2.8'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `webora_backup_${config.slug}_${new Date().toISOString().substring(0, 10)}.json`);
    dlAnchor.click();
    showToast('Copia de seguridad descargada', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Configuración General del Sistema
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Parámetros fiscales, divisa operativa, formatos de impresión y respaldos de datos.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Currency and Taxes */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
            <DollarSign className="w-4 h-4 text-neutral-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              Moneda y Régimen Fiscal
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Moneda Principal
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none"
              >
                <option value="MXN">MXN (Pesos Mexicanos)</option>
                <option value="USD">USD (Dólares Americanos)</option>
                <option value="EUR">EUR (Euros)</option>
                <option value="COP">COP (Pesos Colombianos)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Símbolo Monetario
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tasa de Impuesto (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Backup and Data Maintenance */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
            <Database className="w-4 h-4 text-neutral-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              Mantenimiento y Respaldo de Datos
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div>
              <div className="font-semibold text-xs text-neutral-900">
                Exportar Copia de Seguridad JSON
              </div>
              <div className="text-[11px] text-neutral-500">
                Descarga un archivo con toda la configuración, productos y pedidos actuales.
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar JSON
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-amber-50/50 rounded-lg border border-amber-200">
            <div>
              <div className="font-semibold text-xs text-amber-900">
                Restablecer datos de demostración
              </div>
              <div className="text-[11px] text-amber-700">
                Vuelve al estado original del negocio de ejemplo para nuevas grabaciones de video o reuniones comerciales.
              </div>
            </div>
            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-white border border-amber-300 hover:bg-amber-50 rounded-lg shadow-xs whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restaurar demo
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>
    </div>
  );
};
