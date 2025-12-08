import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSignIn } from '@app/api/hooks/authHooks';
import { getErrorMessage } from '@app/utils/getErrorMessage';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const mutation = useSignIn({
    onSuccess: () => {
      navigate('/');
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err) || '로그인에 실패했습니다.';
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setError(null);
    mutation.mutate({ email, password });
  };

  return (
    <Container>
      <Card>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <Label>
            이메일
            <StyledInput
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='이메일을 입력하세요'
            />
          </Label>

          <Label>
            비밀번호
            <StyledInput
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='비밀번호를 입력하세요'
            />
          </Label>

          {error && <ErrorText>{error}</ErrorText>}

          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </Form>

        <Footer>
          아직 계정이 없나요? <RouterLink to='/signup'>회원가입</RouterLink>
        </Footer>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
  background: ${({ theme }) => theme.colors.background};
  min-height: calc(100dvh - 60px); /* 헤더 높이 제외 */
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(18, 18, 18, 0.06);
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.inputBg};
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => props.theme.colors.text};
  &::placeholder {
    color: ${(props) => props.theme.colors.inputPlaceholder};
  }
`;

const Button = styled.button`
  margin-top: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 13px;
`;

const Footer = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const RouterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary600};
  text-decoration: none;
  margin-left: 6px;
`;
