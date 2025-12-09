import styled from '@emotion/styled';
import { Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMe } from '@app/api/hooks/userHooks';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
};

export default function EditPage() {
  // 프로필 입력값 상태

  const [profile, setProfile] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
  });

  // 로그인된 사용자 정보 불러오기
  const { data: me } = useMe();

  useEffect(() => {
    if (!me) return;

    // 백엔드에서 내려오는 사용자 정보로 폼 초기값 설정
    setProfile({
      name: me.name ?? '',
      email: me.email ?? '',
      phone: me.phone ?? '',
    });
  }, [me]);

  return (
    <Wrapper>
      <PageContainer>
        <Header>
          <Title>프로필 수정</Title>
          <Subtitle>서비스 이용을 위해 기본 정보를 등록해주세요.</Subtitle>
        </Header>

        <Content>
          {/* 왼쪽: 프로필 이미지 영역 */}
          <ProfileSection>
            <ProfileCircle>
              <Camera size={40} />
            </ProfileCircle>
            <ProfileText>프로필 사진</ProfileText>
            <UploadButton type='button'>사진 업로드</UploadButton>
          </ProfileSection>

          {/* 오른쪽: 정보 입력 폼 */}
          <FormSection>
            <FormRow>
              <Label htmlFor='name'>이름</Label>
              <Input
                id='name'
                placeholder='이름을 입력하세요'
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              />
            </FormRow>

            <FormRow>
              <Label htmlFor='email'>이메일</Label>
              <Input
                id='email'
                type='email'
                placeholder='이메일 주소를 입력하세요'
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              />
            </FormRow>

            <FormRow>
              <Label htmlFor='phone'>전화번호</Label>
              <Input
                id='phone'
                type='tel'
                placeholder='전화번호를 입력하세요 (ex. 010-0000-0000)'
                value={profile.phone}
                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </FormRow>

            <FormFooter>
              <PrimaryButton type='button'>저장하기</PrimaryButton>
            </FormFooter>
          </FormSection>
        </Content>
      </PageContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 40px;
  background: #f2f2f2;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

const PageContainer = styled.main`
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 32px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e1e1e;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777876;
`;

const Content = styled.section`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProfileCircle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: #f4f5f2;
  border: 2px dashed #d3d5d1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f928d;
`;

const ProfileText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #4c4c4c;
`;

const UploadButton = styled.button`
  margin-top: 4px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e0e1e0;
  background-color: #fefefe;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4f9e4;
  }
`;

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4c4c4c;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e1e0;
  background-color: #fafaf9;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;

  &::placeholder {
    color: #999a99;
  }

  &:focus {
    outline: none;
    border-color: #90ce0c;
    background-color: #ffffff;
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const PrimaryButton = styled.button`
  padding: 12px 24px;
  border-radius: 14px;
  border: none;
  background-color: #c6ef52;
  font-size: 15px;
  font-weight: 600;
  color: #1e1e1e;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b0e030;
  }
`;
