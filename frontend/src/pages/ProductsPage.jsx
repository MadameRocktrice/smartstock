import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';

const Container = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
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

  useEffect(() => {
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
    loadProducts();
  }, []);

  return (
    <Container>
      <Title>Vorräte</Title>
      <Subtitle>
        {loading ? 'Lade Produkte...' : `${products.length} Produkte im Vorrat`}
      </Subtitle>

      <Placeholder>
        Die neue Vorräte-Übersicht wird hier gebaut.
      </Placeholder>
    </Container>
  );
}

export default ProductsPage;