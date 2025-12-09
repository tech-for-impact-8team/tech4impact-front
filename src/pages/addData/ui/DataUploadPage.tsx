import React, { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import * as S from './DataUploadPage.styles';
import { useNavigate } from 'react-router-dom';
import { uploadFilesPresigned, useCreateRamp, useUploadExcel } from '@app/api/hooks/rampMutations';

export const DataUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const navigate = useNavigate();

  const [selectedExcelFiles, setSelectedExcelFiles] = useState<File[]>([]);

  // form fields for single upload
  const [districtInput, setDistrictInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [tradeNameInput, setTradeNameInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [widthInput, setWidthInput] = useState<string>('');

  const createMutation = useCreateRamp();
  const uploadExcelMutation = useUploadExcel();
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploadedResults, setUploadedResults] = useState<
    import('@app/api/hooks/rampMutations').PresignedResponse[] | null
  >(null);

  const onSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    setFileError(null);
    setStatusMessage(null);

    if (mode === 'single') {
      // 단건 이미지 업로드: 첫 번째 파일만 사용
      const file = filesList?.[0] || null;
      setSelectedFile(null);
      setSelectedExcelFiles([]);

      if (!file) return;

      const allowed = /^(image)\//;
      if (!allowed.test(file.type)) {
        setFileError('이미지 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFileError('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      setSelectedFile(file);
      (async () => {
        try {
          setIsUploading(true);
          setStatusMessage('Presign 요청 중...');
          const results = await uploadFilesPresigned([file]);
          setUploadedResults(results);
          setStatusMessage('이미지 업로드 완료');
        } catch (err) {
          const msg = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.';
          setFileError(msg);
          setSelectedFile(null);
        } finally {
          setIsUploading(false);
        }
      })();
    } else {
      // bulk excel: 여러 파일을 허용
      setSelectedFile(null);
      setUploadedResults(null);
      setSelectedExcelFiles([]);

      if (!filesList || filesList.length === 0) {
        return;
      }

      const allowedExcel = /\.(xlsx|xls)$/i;
      const files = Array.from(filesList);
      const validFiles: File[] = [];

      for (const file of files) {
        if (!file.name.match(allowedExcel)) {
          setFileError('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
          return;
        }
        if (file.size > 20 * 1024 * 1024) {
          setFileError('엑셀 파일 크기는 20MB 이하여야 합니다.');
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setFileError('업로드할 엑셀 파일을 선택해 주세요.');
        return;
      }

      setSelectedExcelFiles(validFiles);
      setStatusMessage(
        `${validFiles.length}개의 파일 업로드 준비 완료 — "엑셀 업로드하기" 버튼을 눌러 업로드하세요.`,
      );
    }
  };

  const handleExcelUpload = async () => {
    if (!selectedExcelFiles.length) {
      setFileError('업로드할 엑셀 파일을 선택해 주세요.');
      return;
    }

    try {
      setIsUploading(true);
      setStatusMessage('엑셀 업로드 중...');

      // 여러 파일을 순차적으로 업로드
      for (const file of selectedExcelFiles) {
        await uploadExcelMutation.mutateAsync(file);
      }

      setStatusMessage(`엑셀 ${selectedExcelFiles.length}개 업로드 완료 — 목록을 갱신합니다.`);
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '엑셀 업로드 중 오류가 발생했습니다.';
      setFileError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
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
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                <S.FileSelectButton type='button' onClick={onSelectFileClick}>
                  엑셀 파일 선택 (.xlsx, .xls)
                </S.FileSelectButton>

                {selectedExcelFiles.length > 0 && (
                  <S.FileInfo>
                    <strong>{selectedExcelFiles.length}개 파일 선택됨</strong>
                    <ul>
                      {selectedExcelFiles.map((file) => (
                        <li key={file.name}>
                          {file.name} - {(file.size / 1024).toFixed(1)} KB
                        </li>
                      ))}
                    </ul>
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
                <S.UploadInner onClick={() => fileInputRef.current?.click()} role='button'>
                  <S.UploadIcon>📷</S.UploadIcon>
                  <S.UploadText>
                    {selectedFile ? selectedFile.name : '이 곳에 이미지를 업로드하세요'}
                  </S.UploadText>
                  <S.UploadSubText>이미지 파일만 업로드 (최대 10MB)</S.UploadSubText>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </S.UploadInner>
              </S.UploadArea>

              {/* 오른쪽 폼 영역 (뼈대) */}
              <S.FormArea>
                {/* 1. 지역 */}
                <S.FormRow>
                  <S.Label>지역</S.Label>
                  <S.TextInput
                    placeholder='구를 입력하세요 (예: 금천구)'
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                  />
                </S.FormRow>

                {/* 2. 상세주소 */}
                <S.FormRow>
                  <S.Label>상세주소</S.Label>
                  <S.TextInput
                    placeholder='상세주소를 입력하세요 (ex. 성남대로 1342)'
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                  />
                </S.FormRow>

                {/* 3. 상호명 */}
                <S.FormRow>
                  <S.Label>상호명</S.Label>
                  <S.TextInput
                    placeholder='상호명을 입력하세요'
                    value={tradeNameInput}
                    onChange={(e) => setTradeNameInput(e.target.value)}
                  />
                </S.FormRow>

                {/* 4. 시설 유형 */}
                <S.FormRow>
                  <S.Label>시설 유형</S.Label>
                  <S.TextInput
                    placeholder='시설 유형을 입력하세요 (예: 식당)'
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                  />
                </S.FormRow>

                {/* 5. 경사로 폭 */}
                <S.FormRow>
                  <S.Label>경사로 폭</S.Label>
                  <S.TextInput
                    placeholder='경사로 폭을 입력하세요 (단위: m) (ex. 1.25)'
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value)}
                  />
                </S.FormRow>

                <S.FormFooter>
                  <S.SubmitButton
                    type='button'
                    disabled={isUploading}
                    onClick={async () => {
                      setFileError(null);
                      setStatusMessage(null);
                      try {
                        setIsUploading(true);
                        setStatusMessage('Presign 요청 중...');

                        let imageKeys: string[] = [];
                        if (uploadedResults && uploadedResults.length > 0) {
                          imageKeys = uploadedResults.map((r) => r.key);
                        } else if (selectedFile) {
                          setStatusMessage('파일 업로드 준비 중...');
                          const results = await uploadFilesPresigned([selectedFile]);
                          imageKeys = results.map((r) => r.key);
                          setStatusMessage('파일 업로드 완료. 생성 요청 중...');
                        } else {
                          setStatusMessage('이미지 없음 — 생성 요청 중...');
                        }

                        const width = widthInput.trim() === '' ? 0 : Number(widthInput);

                        const payload = {
                          district: districtInput,
                          type: typeInput,
                          address: addressInput,
                          tradeName: tradeNameInput,
                          width,
                          latitude: null,
                          longitude: null,
                          imagesKeys: imageKeys,
                        };

                        await createMutation.mutateAsync(payload);
                        setStatusMessage('생성 완료 — 홈으로 이동합니다.');
                        navigate('/');
                      } catch (e) {
                        const msg =
                          e instanceof Error ? e.message : '업로드/등록 중 오류가 발생했습니다.';
                        setFileError(msg);
                        setStatusMessage(null);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  >
                    <Plus size={18} />
                    경사로 등록하기
                  </S.SubmitButton>
                  {statusMessage && <S.StatusText>{statusMessage}</S.StatusText>}
                  {fileError && <S.ErrorText>{fileError}</S.ErrorText>}
                </S.FormFooter>
              </S.FormArea>
            </S.ContentLayout>
          )}
        </S.PageContainer>
      </S.Wrapper>

      {isUploading && (
        <S.LoadingOverlay>
          <S.LoadingSpinner />
          <S.LoadingText>데이터 업로드 중...</S.LoadingText>
        </S.LoadingOverlay>
      )}
    </>
  );
};
