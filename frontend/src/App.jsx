import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import HouseholdPage from './pages/HouseholdPage';
import ProfilePage from './pages/ProfilePage';

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/shoppinglist" element={<ShoppingListPage />} />
          <Route path="/household" element={<HouseholdPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;