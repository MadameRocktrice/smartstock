import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme/theme';
import { useAuth } from '../hooks/useAuth';

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
  margin-bottom: 64px;
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

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Bitte eine gültige E-Mail eingeben')
        .required('E-Mail ist ein Pflichtfeld'),
      password: Yup.string()
        .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
        .required('Passwort ist ein Pflichtfeld'),
    }),
    onSubmit: async (values, { setStatus }) => {
        try {
          await login(values.email, values.password);
          navigate('/dashboard');
        } catch (error) {
          setStatus(error.message || 'Login fehlgeschlagen');
        }
      },
    });

  return (
    <PageContainer>
      <ContentWrapper>
        <Branding>
          <Logo>SmartStock</Logo>
          <Tagline>Bring Ordnung in dein Leben</Tagline>
        </Branding>

        {formik.status && <ErrorBanner>{formik.status}</ErrorBanner>}

        <Form onSubmit={formik.handleSubmit}>
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

        <SwitchLink>
          Noch kein Konto?<Link to="/register">Hier registrieren!</Link>
        </SwitchLink>
      </ContentWrapper>
    </PageContainer>
  );
}

export default LoginPage;