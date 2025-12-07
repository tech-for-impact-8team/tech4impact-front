import React, { useRef, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import * as S from './DataUploadPage.styles';

export const DataUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  const onSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      // 간단한 파일 검증 로직 (확장자 및 크기 체크 등)
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        setFileError('엑셀 파일만 업로드 가능합니다.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFileError('파일 크기는 10MB 이하여야 합니다.');
        setSelectedFile(null);
        return;
      }
      setFileError(null);
    }
  };

  const handleExcelUpload = () => {
    if (!selectedFile) return;

    // TODO: 엑셀 파일 업로드 로직 구현
    console.log('Uploading Excel file:', selectedFile);
  };

  return (
    <S.Wrapper>
      <S.PageContainer>
        <S.Header>
          <S.Title>경사로 데이터 추가하기</S.Title>
          <S.ModeSwitch>
            <S.ModeButton active={mode === 'single'} onClick={() => setMode('single')}>
              단건 업로드
            </S.ModeButton>
            <S.ModeButton active={mode === 'bulk'} onClick={() => setMode('bulk')}>
              엑셀 일괄 업로드
            </S.ModeButton>
          </S.ModeSwitch>
        </S.Header>

        {/* bulk 모드면 상단에 일괄 업로드 패널 표시 (기존 단건 영역과는 분리) */}
        {mode === 'bulk' && (
          <S.BulkPanel>
            <S.ExcelGuide>
              엑셀 일괄 업로드 안내
              <S.GuideList>
                <S.GuideItem>파싱 범위: A5:F999</S.GuideItem>
                <S.GuideItem>
                  컬럼 매핑:
                  <S.GuideList>
                    <S.GuideItem>A: index (연번)</S.GuideItem>
                    <S.GuideItem>B: district (자치구명)</S.GuideItem>
                    <S.GuideItem>C: facilityType (시설유형)</S.GuideItem>
                    <S.GuideItem>D: tradeName (상호명)</S.GuideItem>
                    <S.GuideItem>E: address (주소)</S.GuideItem>
                    <S.GuideItem>F: width (폭)</S.GuideItem>
                  </S.GuideList>
                </S.GuideItem>
              </S.GuideList>
              <S.TemplateLink href='/templates/excel-template.xlsx' download>
                엑셀 템플릿 다운로드
              </S.TemplateLink>
            </S.ExcelGuide>
            <S.ExcelSection>
              <input
                ref={fileInputRef}
                type='file'
                accept='.xlsx,.xls'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <S.FileSelectButton type='button' onClick={onSelectFileClick}>
                엑셀 파일 선택 (.xlsx, .xls)
              </S.FileSelectButton>

              {selectedFile && (
                <S.FileInfo>
                  <strong>{selectedFile.name}</strong>
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </S.FileInfo>
              )}

              {fileError && <S.FileError>{fileError}</S.FileError>}

              <S.ExcelUploadButton type='button' onClick={handleExcelUpload}>
                엑셀 업로드하기
              </S.ExcelUploadButton>
            </S.ExcelSection>
          </S.BulkPanel>
        )}

        {mode === 'single' && (
          <S.ContentLayout>
            {/* 왼쪽 이미지 업로드 영역 (뼈대) - 기존 단건 업로드 UI 유지 */}
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
        )}
      </S.PageContainer>
    </S.Wrapper>
  );
};
