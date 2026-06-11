import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ServicesPage from './pages/customer/ServicesPage';
import GalleryPage from './pages/customer/GalleryPage';
import EnquiryPage from './pages/customer/EnquiryPage';
import ContactPage from './pages/customer/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLayout from './components/admin/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
