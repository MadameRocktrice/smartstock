import { Link } from 'react-router-dom';
import styled from 'styled-components';
import cartIcon from '../assets/icons/cart-neg.svg';
import emptyViewIcon from '../assets/icons/empty-view.svg';
import expireViewIcon from '../assets/icons/expire-view.svg';
import searchIcon from '../assets/icons/search.svg';
import closeIcon from '../assets/icons/close.svg';
import shopViewIcon from '../assets/icons/shop-view.svg';
import warningRedIcon from '../assets/icons/warning-red.svg';
import warningYellowIcon from '../assets/icons/warning-yellow.svg';
import { useProducts } from '../hooks/useProducts';
import { useShoppingList } from '../hooks/useShoppingList';
import { theme } from '../theme/theme';
import { api } from '../api/api';
import { useState } from 'react';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 850px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.title};
  font-weight: ${theme.fontWeight.black};
  color: ${theme.colors.primary};
  line-height: 1.1;
`;

const SearchButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${theme.colors.cardBackground};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadow.card};
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SearchBarWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const SearchInputContainer = styled.div`
  flex: 1;
  position: relative;
  
  img {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height:48px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  padding-left: 65px;
  border: none;
  border-radius: ${theme.radius.pill};
  background-color: ${theme.colors.cardBackground};
  box-shadow: ${theme.shadow.card};
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.textPrimary};
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

const CloseSearchButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${theme.colors.cardBackground};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadow.card};
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SearchResults = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
  margin-bottom: ${theme.spacing.xl};
`;

const ResultsSectionTitle = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
`;

const ResultItem = styled(Link)`
  display: block;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.textPrimary};
  text-decoration: none;
  border-radius: ${theme.radius.md};
  
  &:hover {
    background-color: ${theme.colors.background};
  }
`;

const NoResults = styled.p`
  color: ${theme.colors.textSecondary};
  text-align: center;
  padding: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled(Link)`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadow.elevated};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StatIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.radius.md};
  background-color: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 55px;
    height: 55px;
  }
`;

const StatNumber = styled.div`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
  line-height: 1;
  padding: 5px 0 5px 0;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.light};
  color: ${theme.colors.primary};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.textPrimary};
`;

const SeeAllLink = styled(Link)`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ListItem = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.pill};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
`;

const ItemAmount = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.md};
  min-width: 60px;
`;

const ItemName = styled.span`
  color: ${theme.colors.primary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.md};
  flex: 1;
`;

const ItemBadge = styled.span`
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  padding: 4px 12px;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.sm};
`;

const Checkbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.primary};
  background-color: ${(props) => props.$checked ? theme.colors.primary : 'transparent'};
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${(props) => props.$checked ? theme.colors.primary : theme.colors.primaryLight};
  }
`;

const CartButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 18px;
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${theme.colors.border};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const DateText = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.sm};
`;

const WarnIcon = styled.span`
  isplay: flex;
  align-items: center;
  margin-right: ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.spacing.lg};
`;

function DashboardPage() {
  const { products, loading: productsLoading, reload: reloadProducts } = useProducts();
  const { items: shoppingList, loading: shoppingLoading, reload: reloadShopping } = useShoppingList();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const loading = productsLoading || shoppingLoading;

  async function handleReduceAmount(product) {
  try {
    const newAmount = Math.max(0, product.currentAmount - 1);
    await api.updateProduct(product._id, { currentAmount: newAmount });
    reloadProducts();
  } catch (err) {
    console.error('Fehler beim Reduzieren:', err);
  }
}

  // Berechnungen für die Kacheln
  const openShoppingItems = shoppingList.filter((item) => !item.isBought);
  const shoppingCount = openShoppingItems.length;
  
  // Prüfen: Ist dieses Produkt bereits auf der offenen Einkaufsliste?
  const isOnShoppingList = (productId) => {
    return shoppingList.some(
      (item) => item.product?._id === productId && !item.isBought
    );
  };

  const lowStockProducts = products.filter((p) => {
    // Produkte ohne Minimum: zeigen wenn currentAmount <= 1
    if (p.minAmount == null) {
      return p.currentAmount > 0 && p.currentAmount <= 1;
    }
    // Produkte mit Minimum: nicht zeigen (sind auf Einkaufsliste)
    return false;
  });
  const lowStockCount = lowStockProducts.length;
  
  const expiringProducts = products.filter((p) => {
    if (!p.expiryDate) return false;
    if (p.currentAmount === 0) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7;  // läuft in 7 Tagen oder weniger ab
  }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
  const expiringCount = expiringProducts.length;

  // Tageszeit-abhängige Begrüssung
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Guten Morgen!';
    if (hour < 18) return 'Guten Tag!';
    return 'Guten Abend!';
  };

  // Hilfsfunktion: Datum deutsch formatieren
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Prüfen ob Ablaufdatum kritisch (<=3 Tage)
  const isCritical = (dateString) => {
    const daysUntil = Math.ceil(
      (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 3;
  };

    // Suchergebnisse berechnen – nur wenn Suche offen und was eingetippt
    const query = searchQuery.toLowerCase().trim();
    const matchingProducts = query === '' ? [] : products.filter((p) => 
      p.name.toLowerCase().includes(query)
    );
    const matchingShopping = query === '' ? [] : shoppingList.filter((item) => {
      const name = item.product?.name || item.name || '';
      return name.toLowerCase().includes(query);
    });


    async function handleToggleShopping(item) {
  try {
    await api.updateShoppingItem(item._id, { isBought: !item.isBought });
    // Kurz warten, damit User den Haken sieht
    setTimeout(() => reloadShopping(), 500);
  } catch (err) {
    console.error('Fehler beim Abhaken:', err);
  }
}

  async function handleAddToShopping(product) {
  try {
    // Berechnen: wieviel brauchen wir? (Minimum minus aktueller Bestand, min. 1)
    const needed = Math.max(1, product.minAmount - product.currentAmount);
    
    await api.createShoppingItem({
      name: product.name,
      quantity: needed,
      unit: product.unit,
      product: product._id,
      category: product.category?._id || product.category,
      household: product.household?._id || product.household,
    });
    
    reloadShopping();
  } catch (err) {
    console.error('Fehler beim Hinzufuegen:', err);
  }
}

  return (
    <Container>
      <Header>
        <Title>{getGreeting()}</Title>
        {!searchOpen && (
        <SearchButton aria-label="Suchen" 
        onClick={() => setSearchOpen(true)}
        >
          <img src={searchIcon} alt="" width="40" height="40" />
        </SearchButton>
        )}
      </Header>
      <Subtitle>Dein Haushalt auf einen Blick</Subtitle>
          {searchOpen && (
      <>
        <SearchBarWrapper>
        <SearchInputContainer>
          <img src={searchIcon} alt="" />
          <SearchInput
            type="text"
            placeholder="Produkt oder Eintrag suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SearchInputContainer>
        <CloseSearchButton
          aria-label="Suche schliessen"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
        >
          <img src={closeIcon} alt="" width="48" height="48" />
        </CloseSearchButton>
      </SearchBarWrapper>

        {query !== '' && (
          <SearchResults>
            {matchingProducts.length === 0 && matchingShopping.length === 0 ? (
              <NoResults>Keine Treffer für "{searchQuery}"</NoResults>
            ) : (
              <>
                {matchingProducts.length > 0 && (
                  <>
                    <ResultsSectionTitle>Vorräte</ResultsSectionTitle>
                    {matchingProducts.slice(0, 5).map((p) => (
                      <ResultItem key={p._id} to={`/products/${p._id}/edit`}>
                        {p.name}
                      </ResultItem>
                    ))}
                  </>
                )}
                {matchingShopping.length > 0 && (
                  <>
                    <ResultsSectionTitle>Einkaufsliste</ResultsSectionTitle>
                    {matchingShopping.slice(0, 5).map((item) => (
                      <ResultItem key={item._id} to="/shoppinglist">
                        {item.product?.name || item.name}
                      </ResultItem>
                    ))}
                  </>
                )}
              </>
            )}
          </SearchResults>
        )}
      </>
    )}

      <StatsGrid>
        <StatCard to="/shoppinglist">
          <StatIconWrapper $bgColor={theme.colors.primaryLight}>
            <img src={shopViewIcon} alt="" />
          </StatIconWrapper>
          <div>
            <StatNumber>{loading ? '–' : shoppingCount}</StatNumber>
            <StatLabel>Einkaufen</StatLabel>
          </div>
        </StatCard>

        <StatCard to="/products?tab=knapp">
          <StatIconWrapper $bgColor={theme.colors.secondaryLight}>
            <img src={emptyViewIcon} alt="" />
          </StatIconWrapper>
          <div>
            <StatNumber>{loading ? '–' : lowStockCount}</StatNumber>
            <StatLabel>Knapp</StatLabel>
          </div>
        </StatCard>

        <StatCard to="/products?tab=ablaufend">
          <StatIconWrapper $bgColor={theme.colors.signalLight}>
            <img src={expireViewIcon} alt="" />
          </StatIconWrapper>
          <div>
            <StatNumber>{loading ? '–' : expiringCount}</StatNumber>
            <StatLabel>Ablaufend</StatLabel>
          </div>
        </StatCard>
      </StatsGrid>
  {/* Sektion: Einkaufen */}
      <Section>
        <SectionHeader>
          <SectionTitle>Einkaufen</SectionTitle>
          <SeeAllLink to="/shoppinglist">Alle ansehen</SeeAllLink>
        </SectionHeader>
        
        {openShoppingItems.length === 0 ? (
          <EmptyText>Keine offenen Einkäufe</EmptyText>
        ) : (
          <ItemList>
            {openShoppingItems.slice(0, 3).map((item) => (
              <ListItem key={item._id}>
                <ItemAmount>{item.quantity} {item.unit || 'Stk.'}</ItemAmount>
                <ItemName>{item.product?.name || item.name}</ItemName>
                <Checkbox 
  $checked={item.isBought} 
  onClick={() => handleToggleShopping(item)}
>
  {item.isBought && '✓'}
</Checkbox>
              </ListItem>
            ))}
          </ItemList>
        )}
      </Section>

      {/* Sektion: Knapper Vorrat */}
      <Section>
        <SectionHeader>
          <SectionTitle>Knapper Vorrat</SectionTitle>
          <SeeAllLink to="/products">Alle ansehen</SeeAllLink>
        </SectionHeader>
        
        {lowStockProducts.length === 0 ? (
          <EmptyText>Alles ausreichend vorhanden</EmptyText>
        ) : (
          <ItemList>
            {lowStockProducts.slice(0, 3).map((product) => (
              <ListItem key={product._id}>
                <ItemName>{product.name}</ItemName>
                {product.minAmount != null && (
                <ItemBadge 
                  $bgColor={theme.colors.secondaryLight} 
                  $color={theme.colors.secondary}
                >
                  {product.currentAmount}/{product.minAmount}
                </ItemBadge>
              )}
                <CartButton aria-label="Auf Einkaufsliste"
                  onClick={() => handleAddToShopping(product)}
                  disabled={isOnShoppingList(product._id)}
                >
  <img src={cartIcon} alt="" width="40" height="40" /></CartButton>
              </ListItem>
            ))}
          </ItemList>
        )}
      </Section>

      {/* Sektion: Ablaufend */}
      <Section>
        <SectionHeader>
          <SectionTitle>Ablaufend</SectionTitle>
          <SeeAllLink to="/products">Alle ansehen</SeeAllLink>
        </SectionHeader>
        
        {expiringProducts.length === 0 ? (
          <EmptyText>Keine Produkte laufen bald ab</EmptyText>
        ) : (
          <ItemList>
            {expiringProducts.slice(0, 3).map((product) => (
              <ListItem key={product._id}>
                <WarnIcon>
                  <img 
                    src={isCritical(product.expiryDate) ? warningRedIcon : warningYellowIcon} 
                    alt="" 
                    width="40" 
                    height="40" 
                  />
                </WarnIcon>
                <ItemName>{product.name}</ItemName>
                <DateText>{formatDate(product.expiryDate)}</DateText>
                <Checkbox 
      onClick={() => handleReduceAmount(product)}
      title={`Noch ${product.currentAmount} ${product.unit || 'Stk.'} – 1 verbrauchen`}
    />
              </ListItem>
            ))}
          </ItemList>
        )}
      </Section>
    </Container>

  );
}

export default DashboardPage;