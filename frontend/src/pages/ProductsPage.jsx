import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';
import { useProducts } from '../hooks/useProducts';
import searchIcon from '../assets/icons/search.svg';
import filterIcon from '../assets/icons/filter.svg';
import moreIcon from '../assets/icons/more.svg';
import editIcon from '../assets/icons/edit.svg';
import deleteIcon from '../assets/icons/delete.svg';



const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.pill};
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.lg};
  box-shadow: ${theme.shadow.card};
  
  img {
    width: 40px;
    height: 40px;
    margin-right: ${theme.spacing.sm};
    opacity: 0.6;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.md} 0;
  border: none;
  background: transparent;
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.textPrimary};
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:focus {
    outline: none;
  }
`;

const FilterButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: ${theme.shadow.card};
  font-size: 20px;
`;

const TabsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const Tab = styled.button`
  background: none;
  border: none;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  padding: ${theme.spacing.xs} 0;
  position: relative;
  
  ${(props) => props.$active && `
    font-weight: ${theme.fontWeight.semibold};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${theme.colors.textPrimary};
    }
  `}
`;

const SortDropdown = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
`;

const LocationGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const LocationTitle = styled.h2`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ProductItem = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.pill};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
`;

const ProductName = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.md};
  flex: 1;
`;

const AmountPill = styled.div`
  background-color: ${(props) => props.$bgColor};
  border-radius: ${theme.radius.pill};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: 4px;
`;

const AmountButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const AmountValue = styled.span`
  color: ${(props) => props.$color};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  min-width: 24px;
  text-align: center;
`;

const MoreButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 24px;
    height: 24px;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.elevated};
  overflow: hidden;
  z-index: 10;
  min-width: 160px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: ${theme.spacing.xs} ${theme.spacing.xs};
  border: none;
  background: ${(props) => props.$variant === 'danger' ? theme.colors.signal : theme.colors.primary};
  color: white;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-align: left;
  
  &:hover {
    opacity: 0.9;
  }
  
  img {
    width: 40px;
    height: 40px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
`;


function ProductsPage() {
  const { products, loading, reload } = useProducts();
  const [activeTab, setActiveTab] = useState('alle');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Menu schliessen bei Klick ausserhalb
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Produkte nach Tab filtern
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'knapp') {
      return p.currentAmount <= p.minAmount;
    }
    if (activeTab === 'ablaufend') {
      if (!p.expiryDate) return false;
      const daysUntil = Math.ceil(
        (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntil <= 7;
    }
    return true; // 'alle'
  });

    // Gruppieren nach Standort
  const groupedByLocation = filteredProducts.reduce((groups, product) => {
    const locationName = product.location?.name || 'Ohne Standort';
    if (!groups[locationName]) {
      groups[locationName] = [];
    }
    groups[locationName].push(product);
    return groups;
  }, {});

  // Ampelfarbe je nach Bestand bestimmen
  const getAmountColors = (product) => {
    if (product.currentAmount === 0) {
      return {
        bg: theme.colors.signalLight,
        color: theme.colors.signal,
      };
    }
    if (product.currentAmount <= product.minAmount) {
      return {
        bg: theme.colors.secondaryLight,
        color: theme.colors.secondary,
      };
    }
    return {
      bg: theme.colors.primaryLight,
      color: theme.colors.primary,
    };
  };

  // Menge anpassen
  const changeAmount = async (product, delta) => {
    const newAmount = Math.max(0, product.currentAmount + delta);
    try {
      await api.updateProduct(product._id, { currentAmount: newAmount });
      reload();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const handleEdit = (productId) => {
    setOpenMenuId(null);
    navigate(`/products/${productId}/edit`);
  };

  const handleDelete = async (product) => {
    setOpenMenuId(null);
    const confirmed = window.confirm(
      `Möchtest du "${product.name}" wirklich löschen?`
    );
    if (!confirmed) return;
    
    try {
      await api.deleteProduct(product._id);
      reload();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      alert('Produkt konnte nicht gelöscht werden');
    }
  };

  return (
    <Container>
            <SearchBar>
        <SearchInputWrapper>
          <img src={searchIcon} alt="" />
          <SearchInput 
            placeholder="Produkt suchen" 
            type="text"
          />
        </SearchInputWrapper>
        <FilterButton aria-label="Filter" ><img src={filterIcon} alt="" width="48" height="48"/> </FilterButton>
      </SearchBar>

      <TabsRow>
        <Tabs>
          <Tab 
            $active={activeTab === 'alle'} 
            onClick={() => setActiveTab('alle')}
          >
            Alle
          </Tab>
          <Tab 
            $active={activeTab === 'knapp'} 
            onClick={() => setActiveTab('knapp')}
          >
            Knapp
          </Tab>
          <Tab 
            $active={activeTab === 'ablaufend'} 
            onClick={() => setActiveTab('ablaufend')}
          >
            Ablaufend
          </Tab>
        </Tabs>
        <SortDropdown>Sortierung: Name A–Z ⌄</SortDropdown>
      </TabsRow>

      {loading ? (
        <EmptyState>Lade Produkte...</EmptyState>
      ) : filteredProducts.length === 0 ? (
        <EmptyState>Keine Produkte vorhanden</EmptyState>
      ) : (
        Object.entries(groupedByLocation).map(([locationName, items]) => (
          <LocationGroup key={locationName}>
            <LocationTitle>{locationName}</LocationTitle>
            <ProductList>
              {items.map((product) => {
                const colors = getAmountColors(product);
                return (
                  <ProductItem key={product._id}>
                    <ProductName>{product.name}</ProductName>
                    <AmountPill $bgColor={colors.bg}>
                      <AmountButton 
                        $color={colors.color}
                        onClick={() => changeAmount(product, -1)}
                        disabled={product.currentAmount === 0}
                      >
                        −
                      </AmountButton>
                      <AmountValue $color={colors.color}>
                        {product.currentAmount}
                      </AmountValue>
                      <AmountButton 
                        $color={colors.color}
                        onClick={() => changeAmount(product, 1)}
                      >
                        +
                      </AmountButton>
                    </AmountPill>
                    <MenuWrapper ref={openMenuId === product._id ? menuRef : null}>
                      <MoreButton
                        onClick={() =>
                          setOpenMenuId(openMenuId === product._id ? null : product._id)
                        }
                        aria-label="Mehr Optionen"
                      >
                        <img src={moreIcon} alt="" />
                      </MoreButton>
                      {openMenuId === product._id && (
                        <Menu>
                          <MenuItem onClick={() => handleEdit(product._id)}>
                            <img src={editIcon} alt="" />
                            Bearbeiten
                          </MenuItem>
                          <MenuItem
                            $variant="danger"
                            onClick={() => handleDelete(product)}
                          >
                            <img src={deleteIcon} alt="" />
                            Löschen
                          </MenuItem>
                        </Menu>
                      )}
                    </MenuWrapper>
                  </ProductItem>
                );
              })}
            </ProductList>
          </LocationGroup>
        ))
      )}
    </Container>
  );
}

export default ProductsPage;