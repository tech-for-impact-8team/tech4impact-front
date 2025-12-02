import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import * as S from './DataUploadPage.styles';

export const DataUploadPage: React.FC = () => {
  return (
    <S.Wrapper>
      <S.PageContainer>
        <S.Header>
          <S.Title>경사로 데이터 추가하기</S.Title>
        </S.Header>

        <S.ContentLayout>
          {/* 왼쪽 이미지 업로드 영역 (뼈대) */}
          <S.UploadArea>
            <S.UploadInner>
              <S.UploadIcon>📷</S.UploadIcon>
              <S.UploadText>이 곳에 이미지를 업로드하세요</S.UploadText>
              <S.UploadSubText>000파일, 000MB까지 가능</S.UploadSubText>
            </S.UploadInner>
          </S.UploadArea>

          {/* 오른쪽 폼 영역 (뼈대) */}
          <S.FormArea>
            {/* 1. 지역 */}
            <S.FormRow>
              <S.Label>지역</S.Label>
              <S.SelectButton type='button'>
                <S.SelectText>지역을 선택하세요</S.SelectText>
                <ChevronDown size={18} />
              </S.SelectButton>
            </S.FormRow>

            {/* 2. 상세주소 */}
            <S.FormRow>
              <S.Label>상세주소</S.Label>
              <S.TextInput placeholder='상세주소를 입력하세요 (ex. 성남대로 1342)' />
            </S.FormRow>

            {/* 3. 상호명 */}
            <S.FormRow>
              <S.Label>상호명</S.Label>
              <S.TextInput placeholder='상호명을 입력하세요' />
            </S.FormRow>

            {/* 4. 시설 유형 */}
            <S.FormRow>
              <S.Label>시설 유형</S.Label>
              <S.SelectButton type='button'>
                <S.SelectText>시설 유형을 선택하세요</S.SelectText>
                <ChevronDown size={18} />
              </S.SelectButton>
            </S.FormRow>

            {/* 5. 경사로 폭 */}
            <S.FormRow>
              <S.Label>경사로 폭</S.Label>
              <S.TextInput placeholder='경사로 폭을 입력하세요 (단위: m) (ex. 1.25)' />
            </S.FormRow>

            <S.FormFooter>
              <S.SubmitButton type='button'>
                <Plus size={18} />
                경사로 등록하기
              </S.SubmitButton>
            </S.FormFooter>
          </S.FormArea>
        </S.ContentLayout>
      </S.PageContainer>
    </S.Wrapper>
  );
};
