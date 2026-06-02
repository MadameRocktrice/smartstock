import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme/theme';

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: ${theme.colors.textPrimary};
`;

const LogoutButton = styled.button`
  background-color: ${theme.colors.lowStock};
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  margin-top: 24px;
  
  &:hover {
    opacity: 0.9;
  }
`;

function ProfilePage() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <Container>
      <Title>Profil</Title>
      <p>Hier kommen die Einstellungen hin.</p>
      <LogoutButton onClick={handleLogout}>Abmelden</LogoutButton>
    </Container>
  );
}

export default ProfilePage;