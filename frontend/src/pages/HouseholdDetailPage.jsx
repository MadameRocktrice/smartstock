import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme/theme';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const BackLink = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.sm};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  padding: 0;
  margin-bottom: ${theme.spacing.md};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.title};
  font-weight: ${theme.fontWeight.black};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.xl} 0;
  line-height: 1.1;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.textPrimary};
  margin: ${theme.spacing.xl} 0 ${theme.spacing.md} 0;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const MemberCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow: ${theme.shadow.card};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MemberName = styled.div`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.md};
`;

const MemberEmail = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OwnerBadge = styled.span`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 4px 10px;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
`;

const InviteForm = styled.form`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
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

const PrimaryButton = styled.button`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  padding: 12px 20px;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  width: 100%;
  margin-bottom: ${theme.spacing.sm};

  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const DangerButton = styled(SecondaryButton)`
  color: #C45F3F;
  border-color: #C45F3F;

  &:hover {
    background-color: #C45F3F;
    color: white;
  }
`;

const StatusText = styled.p`
  color: ${(props) => props.$isError ? '#C45F3F' : theme.colors.primary};
  font-size: ${theme.fontSize.sm};
  margin-top: ${theme.spacing.sm};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: ${theme.spacing.xl} 0 ${theme.spacing.md};
`;


function HouseholdDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);
  const [inviting, setInviting] = useState(false);

  const loadHousehold = async () => {
    try {
      setLoading(true);
      const data = await api.getHousehold(id);
      setHousehold(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Haushalt konnte nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHousehold();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setInviting(true);
      setInviteStatus(null);
      await api.inviteToHousehold(id, inviteEmail.trim());
      setInviteStatus({ message: `${inviteEmail} wurde hinzugefuegt`, isError: false });
      setInviteEmail('');
      await loadHousehold(); // Mitgliederliste neu laden
    } catch (err) {
      setInviteStatus({ message: err.message || 'Einladen fehlgeschlagen', isError: true });
    } finally {
      setInviting(false);
    }
  };

  const handleRename = async () => {
    const newName = window.prompt('Neuer Name für den Haushalt:', household.name);
    if (!newName || newName.trim() === household.name) return;

    try {
      await api.updateHousehold(id, newName.trim());
      await loadHousehold();
    } catch (err) {
      alert('Umbenennen fehlgeschlagen: ' + err.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Haushalt "${household.name}" wirklich löschen?\n\nAlle Produkte, Kategorien und die Einkaufsliste werden gelöscht!`
    );
    if (!confirmed) return;

    try {
      await api.deleteHousehold(id);
      navigate('/profile');
    } catch (err) {
      alert('Löschen fehlgeschlagen: ' + err.message);
    }
  };

  // Loading und Error
  if (loading) {
    return (
      <Container>
        <BackLink onClick={() => navigate('/profile')}>← Zurück zum Profil</BackLink>
        <Title>Lade...</Title>
      </Container>
    );
  }

  if (error || !household) {
    return (
      <Container>
        <BackLink onClick={() => navigate('/profile')}>← Zurück zum Profil</BackLink>
        <Title>Haushalt nicht gefunden</Title>
        <StatusText $isError>{error}</StatusText>
      </Container>
    );
  }

  const isOwner = household.owner?._id === user?._id ||
                  household.owner === user?._id;

  return (
    <Container>
      <BackLink onClick={() => navigate('/profile')}>← Zurück zum Profil</BackLink>
      <Title>{household.name}</Title>

      <SectionTitle>
        Mitglieder ({household.members?.length || 0})
      </SectionTitle>
      <MemberList>
        {household.members?.map((member) => {
          const memberIsOwner = household.owner?._id === member._id ||
                                household.owner === member._id;
          return (
            <MemberCard key={member._id}>
              <MemberInfo>
                <MemberName>{member.username}</MemberName>
                <MemberEmail>{member.email}</MemberEmail>
              </MemberInfo>
              {memberIsOwner && <OwnerBadge>Owner</OwnerBadge>}
            </MemberCard>
          );
        })}
      </MemberList>

      <SectionTitle>Jemand einladen</SectionTitle>
      <InviteForm onSubmit={handleInvite}>
        <Input
          type="email"
          placeholder="E-Mail-Adresse"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          disabled={inviting}
          required
        />
        <PrimaryButton type="submit" disabled={inviting || !inviteEmail.trim()}>
          {inviting ? '...' : 'Einladen'}
        </PrimaryButton>
      </InviteForm>
      {inviteStatus && (
        <StatusText $isError={inviteStatus.isError}>
          {inviteStatus.message}
        </StatusText>
      )}

      {isOwner && (
        <>
          <Divider />
          <SectionTitle>Einstellungen</SectionTitle>
          <SecondaryButton onClick={handleRename}>
            Haushalt umbenennen
          </SecondaryButton>
          <DangerButton onClick={handleDelete}>
            Haushalt löschen
          </DangerButton>
        </>
      )}
    </Container>
  );
}

export default HouseholdDetailPage;