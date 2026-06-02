import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme/theme';

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

const SwitchLink = styled.p`
  text-align: center;
  margin-top: 24px;
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  
  a {
    color: ${theme.colors.primary};
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function RegisterPage() {
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Mindestens 3 Zeichen')
        .max(20, 'Maximal 20 Zeichen')
        .required('Username ist ein Pflichtfeld'),
      email: Yup.string()
        .email('Bitte eine gültige Email eingeben')
        .required('Email ist ein Pflichtfeld'),
      password: Yup.string()
        .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
        .required('Passwort ist ein Pflichtfeld'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwörter stimmen nicht überein')
        .required('Bitte Passwort bestätigen'),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
        // passwordConfirm nicht ans Backend schicken
        const { passwordConfirm, ...registerData } = values;
        
        const response = await fetch('http://localhost:5001/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setStatus(data.message || 'Registrierung fehlgeschlagen');
          return;
        }
        
        // Erfolg! Token speichern und einloggen
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } catch (error) {
        setStatus('Verbindung zum Server fehlgeschlagen');
      }
    },
  });
  
  return (
    <PageContainer>
      <Title>Konto erstellen</Title>
      <Subtitle>Willkommen bei SmartStock!</Subtitle>
      
      {formik.status && <ErrorBanner>{formik.status}</ErrorBanner>}
      
      <Form onSubmit={formik.handleSubmit}>
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="z.B. sonja_b"
            $hasError={formik.touched.username && formik.errors.username}
            {...formik.getFieldProps('username')}
          />
          {formik.touched.username && formik.errors.username && (
            <ErrorText>{formik.errors.username}</ErrorText>
          )}
        </Field>
        
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
            placeholder="Mindestens 6 Zeichen"
            $hasError={formik.touched.password && formik.errors.password}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <ErrorText>{formik.errors.password}</ErrorText>
          )}
        </Field>
        
        <Field>
          <Label htmlFor="passwordConfirm">Passwort bestätigen</Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Passwort wiederholen"
            $hasError={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
            {...formik.getFieldProps('passwordConfirm')}
          />
          {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
            <ErrorText>{formik.errors.passwordConfirm}</ErrorText>
          )}
        </Field>
        
        <Button type="submit">Registrieren</Button>
      </Form>
      
      <SwitchLink>
        Schon ein Konto?<Link to="/login">Hier einloggen</Link>
      </SwitchLink>
    </PageContainer>
  );
}

export default RegisterPage;