import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.cardBackground};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  border-top: 1px solid ${theme.colors.border};
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 500;
  
  &.active {
    color: ${theme.colors.primary};
  }
`;

const Icon = styled.span`
  font-size: 22px;
`;

function BottomNav() {
  return (
    <Nav>
      <NavItem to="/dashboard">
        <Icon>🏠</Icon>
        Dashboard
      </NavItem>
      <NavItem to="/products">
        <Icon>📦</Icon>
        Vorrat
      </NavItem>
      <NavItem to="/shoppinglist">
        <Icon>🛒</Icon>
        Einkauf
      </NavItem>
      <NavItem to="/household">
        <Icon>👥</Icon>
        Haushalt
      </NavItem>
      <NavItem to="/profile">
        <Icon>⚙️</Icon>
        Profil
      </NavItem>
    </Nav>
  );
}

export default BottomNav;