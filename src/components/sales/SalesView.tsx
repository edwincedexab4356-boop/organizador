import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BadgeDollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Building2,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Receipt
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const { orders, config, updateOrderPaymentStatus, showToast } = useStore();

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Pagado' | 'Pendiente'>('all');

  // Strict Financial Metrics: only count orders that are PAID
  const paidOrders = orders.filter((o) => o.paymentStatus === 'Pagado');
  const pendingPaymentOrders = orders.filter((o) => o.paymentStatus === 'Pendiente');

  const totalCollectedRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const totalPendingReceivables = pendingPaymentOrders.reduce((acc, o) => acc + o.total, 0);
  const averageTicket = paidOrders.length > 0 ? Math.round(totalCollectedRevenue / paidOrders.length) : 0;

  // Breakdown by payment method
  const methods = ['Tarjeta', 'Transferencia SPEI', 'Efectivo', 'WhatsApp Pay'] as const;
  const methodStats = methods.map((method) => {
    const ordersForMethod = paidOrders.filter((o) => o.paymentMethod === method);
    const totalAmount = ordersForMethod.reduce((acc, o) => acc + o.total, 0);
    return {
      name: method,
      ordersCount: ordersForMethod.length,
      amount: totalAmount,
      percentage: totalCollectedRevenue > 0 ? Math.round((totalAmount / totalCollectedRevenue) * 100) : 0
    };
  });

  const displayedOrders = orders.filter((o) => {
    if (paymentFilter === 'all') return true;
    return o.paymentStatus === paymentFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Reporte Financiero y Ventas Cobradas
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Registro estricto de transacciones efectivas, métodos de cobro e ingresos reales liquidados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            {paidOrders.length} transacciones liquidadas
          </span>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ingresos Reales Cobrados</span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {config.currencySymbol}{totalCollectedRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Fondos recibidos y validados
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Por Cobrar / Pendiente</span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-700">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">
            {config.currencySymbol}{totalPendingReceivables.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {pendingPaymentOrders.length} pedidos sin liquidar
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ticket Promedio</span>
            <span className="p-1.5 rounded-md bg-neutral-100 text-neutral-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {config.currencySymbol}{averageTicket.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Por transacción efectiva
          </div>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-xl p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Tasa de Conversión</span>
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Pedidos creados vs pagados
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-3">
          Ingresos por Método de Pago Registrado
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methodStats.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">{item.name}</span>
                <span className="text-xs font-bold text-neutral-900">{item.percentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className="bg-neutral-900 h-full rounded-full"
                />
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-mono font-bold text-neutral-900">
                  {config.currencySymbol}{item.amount.toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {item.ordersCount} pagos
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white border border-neutral-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Libro Diario de Transacciones
            </h3>
            <p className="text-xs text-neutral-500">
              Registros con sello de pago y auditoría
            </p>
          </div>

          <div className="inline-flex p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                paymentFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setPaymentFilter('Pagado')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                paymentFilter === 'Pagado'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Pagados ({paidOrders.length})
            </button>
            <button
              onClick={() => setPaymentFilter('Pendiente')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                paymentFilter === 'Pendiente'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Pendientes ({pendingPaymentOrders.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Pedido</th>
                <th className="py-3 px-4 font-semibold">Cliente</th>
                <th className="py-3 px-4 font-semibold">Fecha</th>
                <th className="py-3 px-4 font-semibold">Método</th>
                <th className="py-3 px-4 font-semibold">Monto Bruto</th>
                <th className="py-3 px-4 font-semibold">Estado Cobro</th>
                <th className="py-3 px-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-900">{order.customer.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{order.customer.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">
                    {order.createdAt.substring(0, 16).replace('T', ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-neutral-700">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 text-sm">
                    {config.currencySymbol}{order.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        order.paymentStatus === 'Pagado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {order.paymentStatus === 'Pagado' ? 'COBRADO ✓' : 'PENDIENTE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.paymentStatus === 'Pendiente' ? (
                      <button
                        onClick={() => updateOrderPaymentStatus(order.id, 'Pagado')}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition-colors"
                      >
                        Registrar cobro
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-medium">Liquidado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
