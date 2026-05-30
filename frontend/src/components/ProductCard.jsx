import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid ${(props) => (props.$lowStock ? '#dc2626' : '#10b981')};
`;

const Name = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const Amount = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
`;

const Tag = styled.span`
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
`;

function ProductCard({ name, currentAmount, minAmount, unit, category, location }) {
  const lowStock = currentAmount < minAmount;
  
  return (
    <Card $lowStock={lowStock}>
      <Name>{name}</Name>
      <Amount>
        {currentAmount} {unit}
        {lowStock && ' (Vorrat niedrig!)'}
      </Amount>
      <Meta>
        {category && <Tag>{category}</Tag>}
        {location && <Tag>{location}</Tag>}
      </Meta>
    </Card>
  );
}

export default ProductCard;