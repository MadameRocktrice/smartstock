import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { api } from '../api/api';
import { theme } from '../theme/theme';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: ${theme.colors.textPrimary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid ${(props) => (props.$hasError ? theme.colors.lowStock : theme.colors.border)};
  border-radius: ${theme.radius.md};
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  background-color: ${theme.colors.cardBackground};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border: 1px solid ${(props) => (props.$hasError ? theme.colors.lowStock : theme.colors.border)};
  border-radius: ${theme.radius.md};
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  background-color: ${theme.colors.cardBackground};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${theme.colors.lowStock};
  font-size: 13px;
  margin-top: 4px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 14px;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
`;

const ErrorBanner = styled.div`
  background-color: ${theme.colors.lowStock};
  color: white;
  padding: 12px 16px;
  border-radius: ${theme.radius.md};
  margin-bottom: 16px;
  font-size: 14px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: 40px;
`;

function AddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Beim Laden: Kategorien, Standorte und Haushalte holen
  useEffect(() => {
    async function loadFormData() {
      try {
        const [cats, locs, hhs] = await Promise.all([
          api.getCategories(),
          api.getLocations(),
          api.getHouseholds(),
        ]);
        setCategories(cats);
        setLocations(locs);
        setHouseholds(hhs);
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFormData();
  }, []);
  
  const formik = useFormik({
    initialValues: {
      name: '',
      currentAmount: '',
      minAmount: '',
      unit: '',
      expiryDate: '',
      category: '',
      location: '',
      household: '',
    },
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
        .required('Pflichtfeld'),
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
        // Leeres Ablaufdatum entfernen
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
        <Title>Neues Produkt</Title>
        <LoadingMessage>Lade Formular-Daten...</LoadingMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Title>Neues Produkt</Title>
      
      {formik.status && <ErrorBanner>{formik.status}</ErrorBanner>}
      
      <Form onSubmit={formik.handleSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="z.B. Vollmilch"
            $hasError={formik.touched.name && formik.errors.name}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <ErrorText>{formik.errors.name}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="household">Haushalt</Label>
          <Select
            id="household"
            $hasError={formik.touched.household && formik.errors.household}
            {...formik.getFieldProps('household')}
          >
            <option value="">Bitte wählen...</option>
            {households.map((hh) => (
              <option key={hh._id} value={hh._id}>
                {hh.name}
              </option>
            ))}
          </Select>
          {formik.touched.household && formik.errors.household && (
            <ErrorText>{formik.errors.household}</ErrorText>
          )}
        </Field>
        
        <Row>
          <Field>
            <Label htmlFor="currentAmount">Aktuelle Menge</Label>
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
            <Label htmlFor="minAmount">Mindestmenge</Label>
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
          <Label htmlFor="unit">Einheit</Label>
          <Input
            id="unit"
            type="text"
            placeholder="z.B. Liter, Stück, g"
            $hasError={formik.touched.unit && formik.errors.unit}
            {...formik.getFieldProps('unit')}
          />
          {formik.touched.unit && formik.errors.unit && (
            <ErrorText>{formik.errors.unit}</ErrorText>
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
          <Label htmlFor="expiryDate">Ablaufdatum (optional)</Label>
          <Input
            id="expiryDate"
            type="date"
            {...formik.getFieldProps('expiryDate')}
          />
        </Field>
        
        <Button type="submit">Produkt anlegen</Button>
        <CancelButton type="button" onClick={() => navigate('/products')}>
          Abbrechen
        </CancelButton>
      </Form>
    </PageContainer>
  );
}

export default AddProductPage;