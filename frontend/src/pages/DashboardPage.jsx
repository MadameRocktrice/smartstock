import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';

import shopViewIcon from '../assets/icons/shop-view.svg';
import emptyViewIcon from '../assets/icons/empty-view.svg';
import expireViewIcon from '../assets/icons/expire-view.svg';
import searchIcon from '../assets/icons/search.svg';
import cartIcon from '../assets/icons/cart-neg.svg';
import warningRedIcon from '../assets/icons/warning-red.svg';
import warningYellowIcon from '../assets/icons/warning-yellow.svg';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
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

const StatCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
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
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.md};
  min-width: 60px;
`;

const ItemName = styled.span`
  color: ${theme.colors.textPrimary};
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
  flex-shrink: 0;
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
`;

const DateText = styled.span`
  color: ${theme.colors.textPrimary};
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
  const [products, setProducts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, shoppingData] = await Promise.all([
          api.getProducts(),
          api.getShoppingList(),
        ]);
        setProducts(productsData);
        setShoppingList(shoppingData);
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Berechnungen für die Kacheln
  const openShoppingItems = shoppingList.filter((item) => !item.isBought);
  const shoppingCount = openShoppingItems.length;
  
  const lowStockProducts = products.filter(
    (p) => p.currentAmount <= p.minAmount
  );
  const lowStockCount = lowStockProducts.length;
  
  const expiringProducts = products.filter((p) => {
    if (!p.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7;  // läuft in 7 Tagen oder weniger ab
  });
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

  return (
    <Container>
      <Header>
        <Title>{getGreeting()}</Title>
        <SearchButton aria-label="Suchen" >
          <img src={searchIcon} alt="" width="40" height="40" />
        </SearchButton>
      </Header>
      <Subtitle>Dein Haushalt auf einen Blick</Subtitle>

      <StatsGrid>
        <StatCard>
          <StatIconWrapper $bgColor={theme.colors.primaryLight}>
            <img src={shopViewIcon} alt="" />
          </StatIconWrapper>
          <div>
            <StatNumber>{loading ? '–' : shoppingCount}</StatNumber>
            <StatLabel>Einkaufen</StatLabel>
          </div>
        </StatCard>

        <StatCard>
          <StatIconWrapper $bgColor={theme.colors.secondaryLight}>
            <img src={emptyViewIcon} alt="" />
          </StatIconWrapper>
          <div>
            <StatNumber>{loading ? '–' : lowStockCount}</StatNumber>
            <StatLabel>Knapp</StatLabel>
          </div>
        </StatCard>

        <StatCard>
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
                <ItemAmount>{item.quantity} Stk.</ItemAmount>
                <ItemName>{item.productName || item.name}</ItemName>
                <Checkbox />
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
                <ItemBadge 
                  $bgColor={theme.colors.secondaryLight} 
                  $color={theme.colors.secondary}
                >
                  {product.currentAmount}/{product.minAmount}
                </ItemBadge>
                <CartButton aria-label="Auf Einkaufsliste"><img src={cartIcon} alt="" width="40" height="40" /></CartButton>
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
              </ListItem>
            ))}
          </ItemList>
        )}
      </Section>
    </Container>

  );
}

export default DashboardPage;