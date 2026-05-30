import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { theme } from '../theme/theme';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 24px;
  background-color: ${theme.colors.background};
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: 32px;
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

const ErrorText = styled.p`
  color: ${theme.colors.lowStock};
  font-size: 13px;
  margin-top: 4px;
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

const ErrorBanner = styled.div`
  background-color: ${theme.colors.lowStock};
  color: white;
  padding: 12px 16px;
  border-radius: ${theme.radius.md};
  margin-bottom: 16px;
  font-size: 14px;
`;

function LoginPage() {
    const navigate = useNavigate();
    const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Bitte eine gueltige Email eingeben')
        .required('Email ist ein Pflichtfeld'),
      password: Yup.string()
        .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
        .required('Passwort ist ein Pflichtfeld'),
    }),
    onSubmit: async (values, { setStatus }) => {
  try {
    const response = await fetch('http://localhost:5001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      setStatus(data.message || 'Login fehlgeschlagen');
      return;
    }
    
    // Erfolg! Token speichern
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Weiterleitung zum Dashboard
    navigate('/dashboard');
    
  } catch (error) {
    setStatus('Verbindung zum Server fehlgeschlagen');
  }
},
  });

  return (
    <PageContainer>
      <Title>SmartStock</Title>
      <Subtitle>Willkommen zurueck!</Subtitle>

      {formik.status && (
  <ErrorBanner>{formik.status}</ErrorBanner>
)}
      
      <Form onSubmit={formik.handleSubmit}>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="deine@email.ch"
            $hasError={formik.touched.email && formik.errors.email}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <ErrorText>{formik.errors.email}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            placeholder="Passwort eingeben"
            $hasError={formik.touched.password && formik.errors.password}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <ErrorText>{formik.errors.password}</ErrorText>
          )}
        </Field>
        
        <Button type="submit">Einloggen</Button>
      </Form>
    </PageContainer>
  );
}

export default LoginPage;