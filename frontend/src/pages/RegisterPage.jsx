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
  align-items: center;
  padding: 32px 24px;
  background-color: ${theme.colors.background};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Branding = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Logo = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.title};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.1;
`;

const Tagline = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textPrimary};
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
  font-weight: ${theme.fontWeight.light};
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
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:focus {
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${theme.colors.signal};
  font-size: ${theme.fontSize.sm};
  margin-top: ${theme.spacing.xs};
  padding-left: 20px;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 18px;
  border: none;
  border-radius: ${theme.radius.pill};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
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

const SwitchLink = styled.p`
  text-align: center;
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.md};
  
  a {
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeight.semibold};
    text-decoration: none;
    margin-left: ${theme.spacing.xs};
    
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
        .email('Bitte eine gültige E-Mail eingeben')
        .required('E-Mail ist ein Pflichtfeld'),
      password: Yup.string()
        .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
        .required('Passwort ist ein Pflichtfeld'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwörter stimmen nicht überein')
        .required('Bitte Passwort bestätigen'),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
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
      <ContentWrapper>
        <Branding>
          <Logo>Konto erstellen</Logo>
          <Tagline>Willkommen bei SmartStock</Tagline>
        </Branding>

        {formik.status && <ErrorBanner>{formik.status}</ErrorBanner>}

        <Form onSubmit={formik.handleSubmit}>
          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Wie heisst du?"
              $hasError={formik.touched.username && formik.errors.username}
              {...formik.getFieldProps('username')}
            />
            {formik.touched.username && formik.errors.username && (
              <ErrorText>{formik.errors.username}</ErrorText>
            )}
          </Field>

          <Field>
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="deine@email.com"
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
            <Label htmlFor="passwordConfirm">Passwort wiederholen</Label>
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
      </ContentWrapper>
    </PageContainer>
  );
}

export default RegisterPage;