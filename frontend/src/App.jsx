import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import HouseholdPage from './pages/HouseholdPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';

const AppContainer = styled.div`
  padding-bottom: 80px; // Platz für die Bottom-Nav
  min-height: 100vh;
`;

function App() {
  return (
    <BrowserRouter>
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
          <Route path="/household" element={
            <ProtectedRoute>
              <HouseholdPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
        <BottomNav />
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;