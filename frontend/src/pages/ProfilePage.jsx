import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme/theme';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.title};
  font-weight: ${theme.fontWeight.black};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.1;
`;

const UserCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  box-shadow: ${theme.shadow.card};
  margin-bottom: ${theme.spacing.xl};
`;

const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
`;

const UserValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.semibold};
  font-size: ${theme.fontSize.md};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.md};
`;

const LogoutButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 18px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  width: 100%;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Title>Profil</Title>

      {user && (
        <UserCard>
          <UserRow>
            <UserLabel>Benutzername</UserLabel>
            <UserValue>{user.username}</UserValue>
          </UserRow>
          <UserRow>
            <UserLabel>E-Mail</UserLabel>
            <UserValue>{user.email}</UserValue>
          </UserRow>
        </UserCard>
      )}

      <LogoutButton onClick={handleLogout}>
        Abmelden
      </LogoutButton>
    </Container>
  );
}

export default ProfilePage;