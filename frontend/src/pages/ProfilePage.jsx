import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useHouseholds } from '../hooks/useHouseholds';
import { api } from '../api/api';
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

const HouseholdCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadow.card};
  margin-bottom: ${theme.spacing.md};
`;

const HouseholdName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const HouseholdMeta = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const ManageButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyHouseholdCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadow.card};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const EmptyText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  margin-bottom: ${theme.spacing.md};
`;

const CreateForm = styled.form`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const CreateButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 0 20px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: ${theme.fontSize.sm};
  margin-top: ${theme.spacing.sm};
`;

function ProfilePage() {
  const { user, logout } = useAuth();
  const { activeHousehold, loading, reload } = useHouseholds();
  const navigate = useNavigate();

  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) return;

    try {
      setCreating(true);
      setError('');
      await api.createHousehold(newHouseholdName.trim());
      setNewHouseholdName('');
      await reload();
    } catch (err) {
      setError(err.message || 'Fehler beim Erstellen');
    } finally {
      setCreating(false);
    }
  };

  const handleManage = () => {
    if (activeHousehold) {
      navigate(`/household/${activeHousehold._id}`);
    }
  };

  // Zählen wie viele Mitglieder
  const memberCount = activeHousehold?.members?.length || 0;
  const isOwner = activeHousehold?.owner?._id === user?._id ||
                  activeHousehold?.owner === user?._id;

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

      <SectionTitle>Mein Haushalt</SectionTitle>

      {loading ? (
        <EmptyHouseholdCard>
          <EmptyText>Lade Haushalt...</EmptyText>
        </EmptyHouseholdCard>
      ) : activeHousehold ? (
        <HouseholdCard>
          <HouseholdName>{activeHousehold.name}</HouseholdName>
          <HouseholdMeta>
            {memberCount} {memberCount === 1 ? 'Mitglied' : 'Mitglieder'}
            {isOwner && ' · Du bist Owner'}
          </HouseholdMeta>
          <ManageButton onClick={handleManage}>Verwalten</ManageButton>
        </HouseholdCard>
      ) : (
        <EmptyHouseholdCard>
          <EmptyText>
            Du bist noch in keinem Haushalt. Erstelle deinen ersten, um Vorräte zu verwalten.
          </EmptyText>
          <CreateForm onSubmit={handleCreateHousehold}>
            <Input
              type="text"
              placeholder="Name des Haushalts"
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              disabled={creating}
            />
            <CreateButton type="submit" disabled={creating || !newHouseholdName.trim()}>
              {creating ? '...' : 'Erstellen'}
            </CreateButton>
          </CreateForm>
          {error && <ErrorText>{error}</ErrorText>}
        </EmptyHouseholdCard>
      )}

      <LogoutButton onClick={handleLogout}>
        Abmelden
      </LogoutButton>
    </Container>
  );
}

export default ProfilePage;