import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import plusIcon from '../assets/icons/plus.svg';
import { theme } from '../theme/theme';

// Deine eigenen Icons importieren
import dashboardIcon from '../assets/icons/dashboard.svg';
import pantryIcon from '../assets/icons/pantry.svg';
import cartIcon from '../assets/icons/cart.svg';
import userIcon from '../assets/icons/user.svg';

const NavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 16px;
  pointer-events: none;
  z-index: 100;
`;

const NavBar = styled.nav`
  position: relative;
  background-color: ${theme.colors.bottomNav};
  border-radius: ${theme.radius.pill};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${theme.shadow.elevated};
  pointer-events: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  text-decoration: none;
  
  &.active {
    opacity: 1;
  }
  
  &:hover {
    opacity: 1;
  }
  
  img {
    width: 40px;
    height: 40px;
  }
`;

const FabSpacer = styled.div`
  width: 56px;
`;

const Fab = styled.button`
  position: absolute;
  top: -33px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  border: 5px solid ${theme.colors.background};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(-50%) scale(1.05);
  }
  
  &:active {
    transform: translateX(-50%) scale(0.95);
  }
`;

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }
  
  const handleFabClick = () => {
    if (location.pathname === '/products') {
      navigate('/products/new');
    } else if (location.pathname === '/shoppinglist') {
      console.log('Manueller Einkaufslisten-Eintrag (kommt später)');
    } else {
      navigate('/products/new');
    }
  };
  
  return (
    <NavWrapper>
      <NavBar>
        <NavItem to="/dashboard">
          <img src={dashboardIcon} alt="Dashboard" />
        </NavItem>

        <NavItem to="/products">
          <img src={pantryIcon} alt="Vorräte" />
        </NavItem>
        
        <FabSpacer />
        <Fab onClick={handleFabClick} aria-label="Hinzufügen">
          <img src={plusIcon} alt="Hinzufügen" width="50" height="50" />
        </Fab>
        
        <NavItem to="/shoppinglist">
          <img src={cartIcon} alt="Einkaufsliste" />
        </NavItem>
        <NavItem to="/profile">
          <img src={userIcon} alt="Profil" />
        </NavItem>
      </NavBar>
    </NavWrapper>
  );
}

export default BottomNav;