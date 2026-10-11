import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, OrderItem } from '../../types';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Star,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const PublicSiteModal: React.FC = () => {
  const {
    isPublicSiteOpen,
    setIsPublicSiteOpen,
    config,
    layout,
    categories,
    products,
    createOrder,
    getWhatsAppOrderUrl,
    showToast
  } = useStore();

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Checkout form in customer view
  const [customerName, setCustomerName] = useState('Cliente Demo');
  const [customerPhone, setCustomerPhone] = useState('+52 55 1234 5678');
  const [customerAddress, setCustomerAddress] = useState('Calle Principal #100');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia SPEI' | 'Tarjeta' | 'WhatsApp Pay'>('WhatsApp Pay');

  if (!isPublicSiteOpen) return null;

  const publishedProducts = products.filter((p) => p.isPublished);
  const displayProducts = selectedCat === 'all'
    ? publishedProducts
    : publishedProducts.filter((p) => p.categoryId === selectedCat);

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const cartDeliveryFee = customerAddress ? 45 : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`"${product.name}" añadido al pedido`, 'info');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleCompleteOrderViaWhatsApp = () => {
    if (cart.length === 0) return;

    const items: OrderItem[] = cart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));

    const newOrder = createOrder({
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        notes: customerNotes
      },
      items,
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      paymentMethod,
      paymentStatus: 'Pendiente',
      status: 'Nuevo'
    });

    // Open WhatsApp with prefilled message
    const waUrl = getWhatsAppOrderUrl(newOrder);
    window.open(waUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
    showToast(`¡Pedido #${newOrder.orderNumber} registrado! Entró en el panel de administración.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex flex-col">
      {/* Top Controller Bar */}
      <div className="h-14 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold tracking-tight text-white">
              VISTA EN VIVO DEL CLIENTE
            </span>
            <span className="text-neutral-500 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-neutral-400 hidden sm:inline">{config.name}</span>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors ${
              device === 'desktop' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Vista Computadora (Desktop)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-colors ${
              device === 'tablet' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Vista Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors ${
              device === 'mobile' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Vista Celular (Mobile)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart Icon in modal header */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mi Carrito ({cartTotalItems})</span>
          </button>

          <button
            onClick={() => setIsPublicSiteOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Cerrar vista cliente"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-y-auto bg-neutral-900/60 p-2 sm:p-6 flex justify-center items-start">
        <div
          className={`bg-white text-neutral-900 transition-all duration-300 shadow-2xl overflow-hidden min-h-full flex flex-col ${
            device === 'desktop'
              ? 'w-full max-w-5xl rounded-2xl'
              : device === 'tablet'
              ? 'w-[768px] rounded-2xl border-4 border-neutral-800'
              : 'w-[385px] rounded-3xl border-8 border-neutral-800 shadow-2xl'
          }`}
        >
          {/* 1. Promotional Banner */}
          {config.bannerActive && (
            <div className="bg-neutral-900 text-white text-xs text-center py-2 px-4 font-medium tracking-wide">
              {config.bannerText}
            </div>
          )}

          {/* 2. Public Store Header */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={config.logo}
                alt={config.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover border border-neutral-200"
              />
              <div>
                <h1 className="font-extrabold text-neutral-900 text-base tracking-tight leading-none">
                  {config.name}
                </h1>
                <p className="text-[11px] text-neutral-500 font-medium truncate max-w-[200px] mt-0.5">
                  {config.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Abierto ahora</span>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Ver carrito de compras"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* 3. Hero Section based on chosen layout */}
          {layout.heroStyle === 'showcase' ? (
            <div className="relative py-14 px-6 text-center bg-neutral-900 text-white overflow-hidden">
              <div
                className="absolute inset-0 opacity-25 bg-cover bg-center"
                style={{ backgroundImage: `url(${config.heroImage})` }}
              />
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <div className="inline-block text-[11px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-3 py-1 rounded-md border border-indigo-800">
                  {config.tagline}
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {layout.heroHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                  {layout.heroSubheadline}
                </p>
                <a
                  href="#catalog"
                  className="inline-block bg-white text-neutral-900 text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-neutral-100 transition-colors"
                >
                  {layout.ctaText}
                </a>
              </div>
            </div>
          ) : layout.heroStyle === 'split' ? (
            <div className="p-6 sm:p-10 bg-white border-b border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {config.tagline}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                  {layout.heroHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  {layout.heroSubheadline}
                </p>
                <a
                  href="#catalog"
                  className="inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  {layout.ctaText}
                </a>
              </div>
              <img
                src={config.heroImage}
                alt="Hero"
                referrerPolicy="no-referrer"
                className="rounded-2xl h-56 w-full object-cover shadow-sm"
              />
            </div>
          ) : (
            <div className="py-10 px-6 bg-white border-b border-neutral-100 text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {layout.heroHeadline}
              </h2>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {layout.heroSubheadline}
              </p>
            </div>
          )}

          {/* 4. Category Tabs */}
          <div id="catalog" className="sticky top-[61px] z-10 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 sm:px-6 py-2.5 overflow-x-auto flex items-center gap-2">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCat === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Todos ({publishedProducts.length})
            </button>
            {categories.filter((c) => c.isPublished).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 5. Product Grid */}
          <div className="p-4 sm:p-6 flex-1 bg-neutral-50/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-neutral-300 transition-all"
                >
                  <div
                    onClick={() => setSelectedProductDetail(product)}
                    className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    {product.isFeatured && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Destacado
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                        {categories.find((c) => c.id === product.categoryId)?.name}
                      </div>
                      <h3
                        onClick={() => setSelectedProductDetail(product)}
                        className="text-xs font-bold text-neutral-900 mt-0.5 line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div className="font-mono font-bold text-neutral-900 text-sm">
                        {config.currencySymbol}{product.price.toLocaleString()}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Information & FAQs footer */}
          <div className="bg-white border-t border-neutral-200 p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Horarios y Ubicación</h4>
                <p className="text-neutral-500 leading-relaxed">
                  {config.address}
                </p>
                <p className="text-neutral-500 mt-1">
                  Atención telefónica: <span className="font-mono">{config.phone}</span>
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Políticas del Negocio</h4>
                <p className="text-neutral-500 leading-relaxed">
                  {config.policies.shipping}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 text-center text-neutral-400 text-[11px]">
              {layout.footerNote}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer / Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-60 bg-neutral-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h3 className="font-bold text-neutral-900 text-sm">
                  Tu Carrito de Pedido ({cartTotalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                  <p className="text-xs">Tu carrito está vacío.</p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Agrega platillos o artículos del catálogo para ordenar.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-lg border border-neutral-200 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="font-bold text-neutral-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-neutral-500 font-mono">
                        {config.currencySymbol}{item.product.price} c/u
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-neutral-100 rounded-md border border-neutral-200">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-neutral-900 w-16 text-right">
                        {config.currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {/* Customer Details Form */}
              {cart.length > 0 && (
                <div className="pt-3 border-t border-neutral-200 space-y-3">
                  <span className="text-xs font-bold text-neutral-900 block">
                    Datos para Confirmación de Pedido
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Teléfono celular *
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-neutral-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Dirección de entrega (o mesa)
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Instrucciones o notas adicionales
                    </label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Ej. Sin cebolla, llamar al llegar..."
                      className="w-full px-3 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{config.currencySymbol}{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Costo de envío</span>
                    <span className="font-mono">{config.currencySymbol}{cartDeliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-neutral-200">
                    <span>Total a pagar</span>
                    <span className="font-mono">{config.currencySymbol}{cartTotal.toLocaleString()} {config.currency}</span>
                  </div>
                </div>

                <button
                  onClick={handleCompleteOrderViaWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar y enviar pedido por WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-neutral-400">
                  Se abrirá WhatsApp con el resumen listo para enviar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200">
            <div className="relative aspect-4/3 bg-neutral-100">
              <img
                src={selectedProductDetail.images[0]}
                alt={selectedProductDetail.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-extrabold text-base text-neutral-900">
                  {selectedProductDetail.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {selectedProductDetail.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="font-mono font-bold text-lg text-neutral-900">
                  {config.currencySymbol}{selectedProductDetail.price.toLocaleString()}
                </span>

                <button
                  onClick={() => {
                    handleAddToCart(selectedProductDetail);
                    setSelectedProductDetail(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar al pedido</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
