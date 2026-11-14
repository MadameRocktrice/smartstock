import { useFormik } from 'formik';
import styled from 'styled-components';
import * as Yup from 'yup';
import { api } from '../api/api';
import { useFormData } from '../hooks/useFormData';
import { theme } from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import { useHouseholds } from '../hooks/useHouseholds';
import { ALL_UNITS } from '../utils/units';

const PageContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.black};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.regular};
  padding-left: 20px;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  background-color: ${theme.colors.cardBackground};
  color: ${theme.colors.textPrimary};
  box-shadow: ${(props) => (props.$hasError ? `0 0 0 2px ${theme.colors.signal}` : 'none')};
  width: 100%;              /* ← NEU: volle Breite */
  box-sizing: border-box;   /* ← NEU: Padding zählt zur Breite */

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }

  /* Browser-Spinner bei type="number" entfernen */
  &[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Select = styled.select`
  padding: 16px 20px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  background-color: ${theme.colors.cardBackground};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231F2D24' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 20px center;
  padding-right: 48px;
  box-shadow: ${(props) => (props.$hasError ? `0 0 0 2px ${theme.colors.signal}` : 'none')};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${theme.colors.signal};
  font-size: ${theme.fontSize.sm};
  padding-left: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 18px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.textSecondary};
  padding: 18px;
  border: none;
  font-size: ${theme.fontSize.md};
  font-family: ${theme.fonts.body};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const ErrorBanner = styled.div`
  background-color: ${theme.colors.signalLight};
  color: ${theme.colors.signal};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
  text-align: center;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xxl};
`;

function AddProductPage() {
  const navigate = useNavigate();
  const { activeHousehold } = useHouseholds();
  const { categories, locations, households, loading } = useFormData();
  
  const formik = useFormik({
    initialValues: {
      name: '',
      currentAmount: '',
      minAmount: '',
      unit: '',
      expiryDate: '',
      category: '',
      location: '',
      household: activeHousehold?._id || '',
    },
    enableReinitialize: true,
    
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name zu kurz')
        .max(50, 'Name zu lang')
        .required('Pflichtfeld'),
      currentAmount: Yup.number()
        .min(0, 'Darf nicht negativ sein')
        .required('Pflichtfeld'),
      minAmount: Yup.number()
        .min(0, 'Darf nicht negativ sein')
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),
      unit: Yup.string()
        .required('Pflichtfeld'),
      category: Yup.string()
        .required('Bitte Kategorie wählen'),
      location: Yup.string()
        .required('Bitte Standort wählen'),
      household: Yup.string()
        .required('Bitte Haushalt wählen'),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
        const dataToSend = { ...values };
        if (!dataToSend.expiryDate) {
          delete dataToSend.expiryDate;
        }
        
        await api.createProduct(dataToSend);
        navigate('/products');
      } catch (err) {
        setStatus(err.message || 'Produkt konnte nicht angelegt werden');
      }
    },
  });
  
  if (loading) {
    return (
      <PageContainer>
        <Title>Produkt hinzufügen</Title>
        <LoadingMessage>Lade Daten...</LoadingMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Title>Produkt hinzufügen</Title>
      
      {formik.status && <ErrorBanner>{formik.status}</ErrorBanner>}
      
      <Form onSubmit={formik.handleSubmit}>
        <Field>
          <Label htmlFor="name">Produktname</Label>
          <Input
            id="name"
            type="text"
            placeholder="z.B. Milch"
            $hasError={formik.touched.name && formik.errors.name}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <ErrorText>{formik.errors.name}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="category">Kategorie</Label>
          <Select
            id="category"
            $hasError={formik.touched.category && formik.errors.category}
            {...formik.getFieldProps('category')}
          >
            <option value="">Bitte wählen...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
          {formik.touched.category && formik.errors.category && (
            <ErrorText>{formik.errors.category}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="location">Standort</Label>
          <Select
            id="location"
            $hasError={formik.touched.location && formik.errors.location}
            {...formik.getFieldProps('location')}
          >
            <option value="">Bitte wählen...</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </Select>
          {formik.touched.location && formik.errors.location && (
            <ErrorText>{formik.errors.location}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="unit">Masseinheit</Label>
          <Input
            id="unit"
            type="text"
            list="unit-options"
            placeholder="z.B. Stück, Liter, Gramm"
            $hasError={formik.touched.unit && formik.errors.unit}
            {...formik.getFieldProps('unit')}
          />
          <datalist id="unit-options">
            {ALL_UNITS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
          {formik.touched.unit && formik.errors.unit && (
            <ErrorText>{formik.errors.unit}</ErrorText>
          )}
        </Field>

        <Row>
          <Field>
            <Label htmlFor="currentAmount">Aktuell</Label>
            <Input
              id="currentAmount"
              type="number"
              placeholder="z.B. 3"
              $hasError={formik.touched.currentAmount && formik.errors.currentAmount}
              {...formik.getFieldProps('currentAmount')}
            />
            {formik.touched.currentAmount && formik.errors.currentAmount && (
              <ErrorText>{formik.errors.currentAmount}</ErrorText>
            )}
          </Field>
          
          <Field>
            <Label htmlFor="minAmount">Minimum (optional)</Label>
            <Input
              id="minAmount"
              type="number"
              placeholder="z.B. 1"
              $hasError={formik.touched.minAmount && formik.errors.minAmount}
              {...formik.getFieldProps('minAmount')}
            />
            {formik.touched.minAmount && formik.errors.minAmount && (
              <ErrorText>{formik.errors.minAmount}</ErrorText>
            )}
          </Field>
        </Row>
        
        <Field>
          <Label htmlFor="expiryDate">Ablaufdatum (optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            {...formik.getFieldProps('expiryDate')}
          />
        </Field>
        
        <Button type="submit">Hinzufügen</Button>
        <CancelButton type="button" onClick={() => navigate('/products')}>
          Abbrechen
        </CancelButton>
      </Form>
    </PageContainer>
  );
}

export default AddProductPage;