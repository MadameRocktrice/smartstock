import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: ${theme.colors.textPrimary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.radius.lg};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${(props) => (props.$lowStock ? theme.colors.lowStock : theme.colors.primary)};
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const ProductInfo = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: 40px;
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.lowStock};
  color: white;
  padding: 16px;
  border-radius: ${theme.radius.md};
  margin-bottom: 16px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: 40px;
  font-size: 16px;
`;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);
  
  if (loading) {
    return (
      <Container>
        <Title>Vorrat</Title>
        <LoadingMessage>Lade Produkte...</LoadingMessage>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Title>Vorrat</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Vorrat</Title>
      
      {products.length === 0 ? (
        <EmptyMessage>
          Noch keine Produkte. Lege dein erstes Produkt an!
        </EmptyMessage>
      ) : (
        <Grid>
          {products.map((product) => (
            <Card 
              key={product._id}
              $lowStock={product.currentAmount < product.minAmount}
            >
              <ProductName>{product.name}</ProductName>
              <ProductInfo>
                {product.currentAmount} {product.unit}
                {product.currentAmount < product.minAmount && ' (Vorrat niedrig!)'}
              </ProductInfo>
              {product.category && (
                <ProductInfo>Kategorie: {product.category.name}</ProductInfo>
              )}
              {product.location && (
                <ProductInfo>Standort: {product.location.name}</ProductInfo>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ProductsPage;