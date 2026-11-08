import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useHouseholds } from '../hooks/useHouseholds';
import { api } from '../api/api';
import { theme } from '../theme/theme';
import saveIcon from '../assets/icons/save.svg';
import deleteIcon from '../assets/icons/delete.svg';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  z-index: 90;
`;

const NoteWrapper = styled.div`
  position: fixed;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 350px;
  height: ${(props) => (props.$isOpen ? '70vh' : '170px')};
  background-color: ${(props) =>
    props.$hasNote ? theme.colors.signalLight : theme.colors.secondaryLight};
  border-radius: 15px 15px 0 0;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.3s ease;
  z-index: 95;
  cursor: ${(props) => (props.$isOpen ? 'default' : 'pointer')};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CollapsedHandle = styled.div`
  padding: 12px 24px;
  display: ${(props) => (props.$isOpen ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.sm};
  opacity: 0.3;
`;

const Grip = styled.div`
  width: 48px;
  height: 4px;
  background-color: ${theme.colors.textPrimary};
  border-radius: 2px;
  opacity: 0.3;
`;

const ExpandedContent = styled.div`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
  padding: 24px 24px 120px 24px;
  height: 100%;
  gap: ${theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.textPrimary};
  padding: 4px 12px;
  line-height: 1;
  opacity: 0.5;

  &:hover {
    color: ${theme.colors.textPrimary};
    opacity: 0.8;
  }
`;

const Textarea = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  padding: 8px 0;
  line-height: 1.5;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const IconButton = styled.button`
  background: ${theme.colors.primary};
  border: none;
  padding: 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s, opacity 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  img {
    width: 40px;
    height: 40px;
  }
`;

const DeleteIconButton = styled(IconButton)`
background: ${theme.colors.signal};  
img {
  }
  &:hover {
    background: ${theme.colors.signalDark};
  }
`;

// --- Komponente ---

function FloatingNote() {
  const location = useLocation();
  const { activeHousehold, reload } = useHouseholds();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  // Wenn Haushalt oder Notiz sich ändert, Draft syncen (nur wenn geschlossen)
  useEffect(() => {
    if (!isOpen) {
      setDraft(activeHousehold?.note || '');
    }
  }, [activeHousehold?.note, isOpen]);

  // Nicht anzeigen auf Login/Register
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Noch kein Haushalt → nicht anzeigen
  if (!activeHousehold) {
    return null;
  }

  const hasNote = Boolean(activeHousehold.note && activeHousehold.note.trim());

  const handleOpen = () => {
    setDraft(activeHousehold.note || '');
    setIsOpen(true);
    // Textarea nach Animation fokussieren
    setTimeout(() => textareaRef.current?.focus(), 450);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateHouseholdNote(activeHousehold._id, draft.trim());
      await reload();
      setIsOpen(false);
    } catch (err) {
      console.error('Fehler beim Speichern der Notiz:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    try {
      setSaving(true);
      await api.updateHouseholdNote(activeHousehold._id, '');
      await reload();
      setDraft('');
      setIsOpen(false);
    } catch (err) {
      console.error('Fehler beim Loeschen der Notiz:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={handleClose} />
      <NoteWrapper
        $isOpen={isOpen}
        $hasNote={hasNote}
        onClick={isOpen ? undefined : handleOpen}
      >
        <CollapsedHandle $isOpen={isOpen}>
          <Grip />
        </CollapsedHandle>

        <ExpandedContent $isOpen={isOpen}>
          <Header>
            <Title>Notiz</Title>
            <CloseButton onClick={handleClose} aria-label="Schliessen">
              ×
            </CloseButton>
          </Header>

          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Was möchtest du deinem Haushalt mitteilen?"
            disabled={saving}
          />

          <ButtonRow>
  {hasNote && (
    <DeleteIconButton onClick={handleClear} disabled={saving} aria-label="Loeschen">
      <img src={deleteIcon} alt="Loeschen" />
    </DeleteIconButton>
  )}
  <IconButton onClick={handleSave} disabled={saving} aria-label="Speichern">
    <img src={saveIcon} alt="Speichern" />
  </IconButton>
</ButtonRow>
        </ExpandedContent>
      </NoteWrapper>
    </>
  );
}

export default FloatingNote;