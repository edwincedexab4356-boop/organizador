import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Store,
  AlertCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, config, setIsPublicSiteOpen } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const ok = login(email, password);
      setIsLoading(false);
      if (!ok) {
        setErrorMessage('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-100 bg-neutral-50/50 text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            W
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Webora Admin Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Acceso al Modo Administrador
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Controla tu catálogo digital, inventario, pedidos y ventas desde un solo panel.
          </p>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webora.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              <span>{isLoading ? 'Verificando...' : 'Entrar al Modo Administrador'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Option to view public store directly */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPublicSiteOpen(true)}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ver sitio publicado sin iniciar sesión</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-neutral-500 text-center mt-6 relative z-10">
        Webora SaaS Solutions © Todos los derechos reservados.
      </p>
    </div>
  );
};
