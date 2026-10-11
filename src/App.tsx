import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { CategoriesView } from './components/categories/CategoriesView';
import { InventoryView } from './components/inventory/InventoryView';
import { OrdersView } from './components/orders/OrdersView';
import { CustomersView } from './components/customers/CustomersView';
import { SalesView } from './components/sales/SalesView';
import { StoreCustomizationView } from './components/customization/StoreCustomizationView';
import { WebsiteAppearanceView } from './components/appearance/WebsiteAppearanceView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { UsersView } from './components/users/UsersView';
import { SettingsView } from './components/settings/SettingsView';
import { PublicSiteModal } from './components/public-site/PublicSiteModal';
import { LoginView } from './components/auth/LoginView';

const MainLayout: React.FC = () => {
  const { currentSection, isAuthenticated } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <PublicSiteModal />
        <ToastContainer />
      </>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'sales':
        return <SalesView />;
      case 'customization':
        return <StoreCustomizationView />;
      case 'appearance':
        return <WebsiteAppearanceView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex">
      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobile={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>

      {/* Interactive Public Site Live Preview */}
      <PublicSiteModal />

      {/* Real-time Feedback Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
