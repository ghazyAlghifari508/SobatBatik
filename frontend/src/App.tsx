import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import { useAuthStore } from './store/useAuthStore'

// Public Pages
import Home from './pages/public/Home'
import ProductDetail from './pages/public/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Pages
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import OrderHistory from './pages/user/OrderHistory'
import StoreApplication from './pages/user/StoreApplication'

// Store Pages
import StoreDashboard from './pages/store/StoreDashboard'
import StoreProducts from './pages/store/StoreProducts'
import StoreOrders from './pages/store/StoreOrders'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApprovals from './pages/admin/AdminApprovals'
import AdminMonitoring from './pages/admin/AdminMonitoring'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & User Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/cart" element={<Cart />} />
          
          {/* Protected User Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['user']}><Checkout /></ProtectedRoute>
          } />
          <Route path="/user/orders" element={
            <ProtectedRoute allowedRoles={['user']}><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/user/apply-store" element={
            <ProtectedRoute allowedRoles={['user']}><StoreApplication /></ProtectedRoute>
          } />
        </Route>

        {/* Store Dashboard Routes */}
        <Route path="/store" element={
          <ProtectedRoute allowedRoles={['store']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<StoreDashboard />} />
          <Route path="products" element={<StoreProducts />} />
          <Route path="orders" element={<StoreOrders />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="monitoring" element={<AdminMonitoring />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
