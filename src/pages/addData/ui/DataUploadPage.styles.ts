/* === styled components: 페이지 전체 틀 & 기본 레이아웃 === */

import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 40px;
  background: #f2f2f2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

export const PageContainer = styled.main`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  padding: 40px 48px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Header = styled.header`
  width: 100%;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e1e1e;
`;

export const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* 왼쪽 업로드 영역 */

export const UploadArea = styled.div`
  background-color: #fafafa;
  border-radius: 20px;
  border: 1px dashed #d3d5d1;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const UploadIcon = styled.div`
  font-size: 32px;
`;

export const UploadText = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #4c4c4c;
`;

export const UploadSubText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #999a99;
`;

/* 오른쪽 폼 영역 */

export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #4c4c4c;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e1e0;
  background-color: #fafaf9;
  font-size: 14px;
  font-weight: 500;

  &::placeholder {
    color: #999a99;
  }

  &:focus {
    outline: none;
    border-color: #90ce0c;
  }
`;

export const SelectButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e1e0;
  background-color: #fafaf9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: #f3f3f1;
  }
`;

export const SelectText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #999a99;
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
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
