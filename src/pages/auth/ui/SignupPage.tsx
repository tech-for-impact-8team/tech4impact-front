import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSignUp } from '@app/api/hooks/authHooks';
import { getErrorMessage } from '@app/utils/getErrorMessage';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validatePhone = (value: string) => {
    // 간단한 숫자 체크 (하이픈, 공백 무시)
    const digits = value.replace(/[^0-9]/g, '');
    return digits.length >= 9 && digits.length <= 11;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !name || !phone) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('유효한 휴대폰 번호를 입력해주세요.');
      return;
    }

    // 실제 회원가입 호출
    signupMutation.mutate({ email, password, name, phone });
  };

  const navigate = useNavigate();

  const signupMutation = useSignUp({
    onSuccess: () => {
      navigate('/');
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err) || '회원가입에 실패했습니다.';
      setError(message);
    },
  });

  return (
    <Container>
      <Card>
        <Title>회원가입</Title>
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

          <Label>
            이름
            <StyledInput
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='이름을 입력하세요'
            />
          </Label>

          <Label>
            휴대폰 번호
            <StyledInput
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='예: 010-1234-5678'
            />
          </Label>

          {error && <ErrorText>{error}</ErrorText>}

          <Button type='submit' disabled={signupMutation.status === 'pending'}>
            {signupMutation.status === 'pending' ? '가입중...' : '회원가입'}
          </Button>
        </Form>

        <Footer>
          이미 계정이 있으신가요? <RouterLink to='/login'>로그인</RouterLink>
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
  max-width: 560px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
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
  grid-column: 1 / -1;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ErrorText = styled.div`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.error};
  font-size: 13px;
`;

const Footer = styled.div`
  grid-column: 1 / -1;
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

const RouterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary600};
  text-decoration: none;
  margin-left: 6px;
`;
