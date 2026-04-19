import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AuthPage from './modules/customer/AuthPage';
import ProductListing from './modules/customer/ProductListing';
import ProductDetail from './modules/customer/ProductDetail';
import CartPage from './modules/customer/CartPage';
import OrdersPage from './modules/customer/OrdersPage';
import RoleRoute from './routes/RoleRoute';
import VendorDashboard from './modules/vendor/Dashboard';
import ProductList from './modules/vendor/ProductList';
import CreateProduct from './modules/vendor/CreateProduct';
import VendorOrders from './modules/vendor/VendorOrders';
import AIRecommendations from './modules/vendor/AIRecommendations';
import AdminDashboard from './modules/admin/AdminDashboard';
import VendorManagement from './modules/admin/VendorManagement';
import CommissionRules from './modules/admin/CommissionRules';
import CategoryManagement from './modules/admin/CategoryManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Auth — full screen, no layout wrapper */}
            <Route path="/login" element={<AuthPage />} />

            {/* Customer Domain */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<ProductListing />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            {/* Vendor Domain */}
            <Route path="/vendor" element={<RoleRoute requiredRole="VENDOR" />}>
              <Route element={<VendorLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/create" element={<CreateProduct />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="ai" element={<AIRecommendations />} />
              </Route>
            </Route>

            {/* Admin Domain */}
            <Route path="/admin" element={<RoleRoute requiredRole="ADMIN" />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="vendors" element={<VendorManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="commissions" element={<CommissionRules />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
