import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import HouseholdPage from './pages/HouseholdPage';
import HouseholdDetailPage from './pages/HouseholdDetailPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import { useSocket } from './hooks/useSocket';
import FloatingNote from './components/FloatingNote';

const AppContainer = styled.div`
  padding-bottom: 80px;
  min-height: 100vh;
`;

// Inner-Komponente, damit useSocket den Auth-Context nutzen kann
// Inner-Komponente, damit useSocket den Auth-Context nutzen kann
function AppContent() {
  useSocket();  // ← Hier wird die globale Socket-Verbindung aktiviert

  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="/products/new" element={
          <ProtectedRoute>
            <AddProductPage />
          </ProtectedRoute>
        } />
        <Route path="/shoppinglist" element={
          <ProtectedRoute>
            <ShoppingListPage />
          </ProtectedRoute>
        } />
        <Route path="/household/:id" element={
          <ProtectedRoute>
            <HouseholdDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/products/:id/edit" element={
          <ProtectedRoute>
            <EditProductPage />
          </ProtectedRoute>
        } />
      </Routes>
      <FloatingNote />
      <BottomNav />
    </AppContainer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;