import { useState } from 'react';
import styled from 'styled-components';
import { useShoppingList } from '../hooks/useShoppingList';
import { api } from '../api/api';
import { theme } from '../theme/theme';
import searchIcon from '../assets/icons/search.svg';
import { shortUnit } from '../utils/units';

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

const SortWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textPrimary};
`;

const SortLabel = styled.span`
  color: ${theme.colors.textSecondary};
`;

const SortSelect = styled.select`
  background: transparent;
  border: none;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  appearance: none;
  padding-right: 16px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%231F2D24' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0 center;

  &:focus {
    outline: none;
  }
`;

const CategoryGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const CategoryTitle = styled.h2`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Item = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.pill};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadow.card};
  opacity: ${(props) => props.$bought ? 0.5 : 1};
`;

const ItemAmount = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.md};
  min-width: 70px;
`;

const ItemName = styled.span`
  color: ${theme.colors.primary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.md};
  flex: 1;
  text-decoration: ${(props) => props.$bought ? 'line-through' : 'none'};
`;

const Ratio = styled.span`
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$color};
  padding: 4px 12px;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.sm};
`;

const Checkbox = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.primary};
  background-color: ${(props) => props.$checked ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  padding: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
`;

function ShoppingListPage() {
  const { items, loading, reload, updateLocal } = useShoppingList();
  const [activeTab, setActiveTab] = useState('alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('category');

  const filteredItems = items.filter((item) => {
    // Erst Tab-Filter
    if (activeTab === 'offen' && item.isBought) return false;
    if (activeTab === 'erledigt' && !item.isBought) return false;

    // Dann Such-Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const productName = item.product?.name || item.name || '';
      const categoryName = item.category?.name || '';
      const nameMatch = productName.toLowerCase().includes(query);
      const categoryMatch = categoryName.toLowerCase().includes(query);
      return nameMatch || categoryMatch;
    }

    return true;
  });

  // Hilfsfunktion fuer den Produktnamen (fuer Sortierung)
  const getItemName = (item) => (item.product?.name || item.name || '').toLowerCase();

  // Sortieren (fuer flache Liste und innerhalb von Gruppen alphabetisch)
  const sortedItems = [...filteredItems].sort((a, b) =>
    getItemName(a).localeCompare(getItemName(b), 'de')
  );

  // Nur bei Sortierung "Kategorie" gruppieren, sonst flache Liste
  const groupedByCategory = sortBy === 'category'
    ? sortedItems.reduce((groups, item) => {
        const categoryName = item.category?.name || 'Ohne Kategorie';
        if (!groups[categoryName]) {
          groups[categoryName] = [];
        }
        groups[categoryName].push(item);
        return groups;
      }, {})
    : null;

  const getRatioColors = (item) => {
    if (!item.product) {
      return { bg: theme.colors.primaryLight, color: theme.colors.primary };
    }
    if (item.product.currentAmount === 0) {
      return { bg: theme.colors.signalLight, color: theme.colors.signal };
    }
    return { bg: theme.colors.secondaryLight, color: theme.colors.secondary };
  };

  const toggleItem = async (item) => {
    const newBought = !item.isBought;
    // UI sofort aktualisieren (Haken erscheint/verschwindet)
    updateLocal(item._id, { isBought: newBought });
    try {
      await api.updateShoppingItem(item._id, { isBought: newBought });
    } catch (err) {
      console.error('Fehler beim Abhaken:', err);
      reload();
    }
  };

  // Ein einzelnes Item rendern (wird bei beiden Ansichten genutzt)
  const renderItem = (item) => {
    const ratioColors = getRatioColors(item);
    const productName = item.product?.name || item.name;
    return (
      <Item key={item._id} $bought={item.isBought}>
        <ItemAmount>
          {item.quantity} {shortUnit(item.unit) || 'Stk.'}
        </ItemAmount>
        <ItemName $bought={item.isBought}>
          {productName}
        </ItemName>
        {item.product && item.product.minAmount != null && (
          <Ratio
            $bgColor={ratioColors.bg}
            $color={ratioColors.color}
          >
            {item.product.currentAmount}/{item.product.minAmount} {shortUnit(item.product.unit)}
          </Ratio>
        )}
        <Checkbox
          $checked={item.isBought}
          onClick={() => toggleItem(item)}
          aria-label={item.isBought ? 'Rückgängig' : 'Abhaken'}
        >
          {item.isBought && '✓'}
        </Checkbox>
      </Item>
    );
  };

  return (
    <Container>
      <SearchBar>
        <SearchInputWrapper>
          <img src={searchIcon} alt="" />
          <SearchInput
            placeholder="Produkt suchen"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchBar>

      <TabsRow>
        <Tabs>
          <Tab $active={activeTab === 'alle'} onClick={() => setActiveTab('alle')}>
            Alle
          </Tab>
          <Tab $active={activeTab === 'offen'} onClick={() => setActiveTab('offen')}>
            Offen
          </Tab>
          <Tab $active={activeTab === 'erledigt'} onClick={() => setActiveTab('erledigt')}>
            Erledigt
          </Tab>
        </Tabs>
        <SortWrapper>
          <SortLabel>Sortierung:</SortLabel>
          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="category">Kategorie</option>
            <option value="name-asc">Name A–Z</option>
          </SortSelect>
        </SortWrapper>
      </TabsRow>

      {loading ? (
        <EmptyState>Lade Einkaufsliste...</EmptyState>
      ) : sortedItems.length === 0 ? (
        <EmptyState>Keine Einträge vorhanden</EmptyState>
      ) : groupedByCategory ? (
        // Gruppiert nach Kategorie
        Object.entries(groupedByCategory).map(([categoryName, categoryItems]) => (
          <CategoryGroup key={categoryName}>
            <CategoryTitle>{categoryName}</CategoryTitle>
            <ItemList>
              {categoryItems.map((item) => renderItem(item))}
            </ItemList>
          </CategoryGroup>
        ))
      ) : (
        // Flache Liste (Name A–Z)
        <ItemList>
          {sortedItems.map((item) => renderItem(item))}
        </ItemList>
      )}
    </Container>
  );
}

export default ShoppingListPage;