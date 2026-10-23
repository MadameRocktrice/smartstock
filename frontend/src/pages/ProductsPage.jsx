import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';
import searchIcon from '../assets/icons/search.svg';

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
    width: 20px;
    height: 20px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.title};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xl};
`;

const Placeholder = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alle');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  }

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
      loadProducts();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
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
        <FilterButton aria-label="Filter">⚙</FilterButton>
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