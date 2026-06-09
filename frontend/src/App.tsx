import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import { useAuthStore } from './store/useAuthStore'

// Public Pages
import Home from './pages/public/Home'
import Shop from './pages/public/Shop'
import ProductDetail from './pages/public/ProductDetail'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Pages
import Cart from './pages/user/Cart'
import Checkout from './pages/user/Checkout'
import OrderHistory from './pages/user/OrderHistory'
import OrderDetail from './pages/user/OrderDetail'
import Profile from './pages/user/Profile'

// Store Pages
import StoreDashboard from './pages/store/StoreDashboard'
import StoreProducts from './pages/store/StoreProducts'
import StoreOrders from './pages/store/StoreOrders'
import StorePending from './pages/store/StorePending'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApprovals from './pages/admin/AdminApprovals'
import AdminMonitoring from './pages/admin/AdminMonitoring'
import AdminFeedback from './pages/admin/AdminFeedback'

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
        {/* Public & User Routes — inside MainLayout */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected (Any Logged-in User) */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

          {/* Protected User Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['user']}><Checkout /></ProtectedRoute>
          } />
          <Route path="/user/orders" element={
            <ProtectedRoute allowedRoles={['user']}><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/user/orders/:id" element={
            <ProtectedRoute allowedRoles={['user']}><OrderDetail /></ProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <ProtectedRoute allowedRoles={['user']}><Profile /></ProtectedRoute>
          } />
        </Route>

        {/* Store Pending — standalone page, no ProtectedRoute to avoid race condition */}
        <Route path="/store/pending" element={<StorePending />} />

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
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
