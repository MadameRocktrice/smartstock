import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import plusIcon from '../assets/icons/plus.svg';
import { theme } from '../theme/theme';

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

const NavContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 70px;
  pointer-events: auto;
`;

const NavBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${theme.colors.bottomNav};
  pointer-events: none;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const NavBar = styled.nav`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
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
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 3;

  &:hover {
    background-color: ${theme.colors.primaryDark};
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
      <NavContainer>
        <NavBackground>
          <svg viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M365.75.43h-109.22c-8.55,0-16.45,5.16-19.34,13.2-5.43,15.13-19.92,25.98-36.9,25.98s-31.46-10.85-36.89-25.98c-2.89-8.05-10.79-13.2-19.34-13.2H34.85C15.77.43.3,15.9.3,34.99s15.47,34.55,34.55,34.55h330.9c19.08,0,34.55-15.47,34.55-34.55S384.83.43,365.75.43"
            />
          </svg>
        </NavBackground>

        <NavBar>
          <NavItem to="/dashboard">
            <img src={dashboardIcon} alt="Dashboard" />
          </NavItem>

          <NavItem to="/products">
            <img src={pantryIcon} alt="Vorräte" />
          </NavItem>

          <FabSpacer />

          <NavItem to="/shoppinglist">
            <img src={cartIcon} alt="Einkaufsliste" />
          </NavItem>

          <NavItem to="/profile">
            <img src={userIcon} alt="Profil" />
          </NavItem>
        </NavBar>

        <Fab onClick={handleFabClick} aria-label="Hinzufügen">
          <img src={plusIcon} alt="Hinzufügen" width="50" height="50" />
        </Fab>
      </NavContainer>
    </NavWrapper>
  );
}

export default BottomNav;