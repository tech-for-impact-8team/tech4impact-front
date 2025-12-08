import { ChevronDown, Search, Filter, Plus, MoreVertical } from 'lucide-react';
import React from 'react';
import * as S from './DataPage.styles';
import { Checkbox } from './DataPageComponents';
import { useDataPageLogic } from '@shared/hooks/useDataPageLogic';
import { useNavigate } from 'react-router-dom';

// export용 페이지 컴포넌트 (필터/페이지네이션/체크박스 UI를 렌더링)
export const DataPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    // 상태 값
    selectedLocation,
    isLocationOpen,
    selectedFacilityType,
    isFacilityOpen,
    isMoreMenuOpen,
    districtOptions,
    facilityTypes,
    paginatedData,
    checkedRows,
    paginationPages,
    currentPage,
    totalPages,

    // 유틸/헬퍼
    getCurrentRangeStart,
    // 핸들러들
    toggleAllRows,
    toggleRowCheck,
    handleClickLocation,
    handleSelectDistrict,
    handleClickFacilityFilter,
    handleSelectFacilityType,
    handlePrevPage,
    handleNextPage,
    handlePrevRange,
    handleNextRange,
    handleToggleMoreMenu,
    handleDeleteSelected,
    goToPage,
    setSearchQuery,
    isLoadingData,
    isErrorData,
  } = useDataPageLogic();

  // local search state (typing은 디바운스, Enter는 즉시, 한글 조합(IME) 중에는 검색 트리거하지 않음)
  const [localSearch, setLocalSearch] = React.useState('');
  const composingRef = React.useRef(false);
  const debounceRef = React.useRef<number | null>(null);
  const DEBOUNCE_MS = 300;

  const triggerSearch = (value: string, immediate = false) => {
    const v = value.trim();
    if (immediate) {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setSearchQuery(v === '' ? undefined : v);
      goToPage(1);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(v === '' ? undefined : v);
      goToPage(1);
      debounceRef.current = null;
    }, DEBOUNCE_MS) as unknown as number;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch(localSearch, true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (!composingRef.current) {
      triggerSearch(val, false);
    }
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    composingRef.current = false;
    // composition이 끝난 값으로 검색(디바운스 적용)
    const val = (e.target as HTMLInputElement).value;
    triggerSearch(val, false);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  // debug: log sample rows in dev only
  React.useEffect(() => {
    if (import.meta.env && import.meta.env.DEV) {
      console.debug('[DataPage] paginatedData sample', paginatedData.slice(0, 5));
    }
  }, [paginatedData]);

  return (
    <S.Wrapper>
      <S.PageContainer>
        <S.ContentSection>
          <S.Header>
            <S.HeaderLeft>
              <S.LocationWrapper>
                <S.LocationButton type='button' onClick={handleClickLocation}>
                  <S.LocationIcon alt='Location icon' src='src/shared/assets/location.svg' />
                  <S.LocationText>{selectedLocation}</S.LocationText>
                  <ChevronDown size={20} />
                </S.LocationButton>

                {isLocationOpen && (
                  <S.LocationDropdown>
                    {districtOptions.map((name: string) => (
                      <S.LocationDropdownItem
                        key={name}
                        active={name === selectedLocation}
                        onClick={() => handleSelectDistrict(name)}
                      >
                        {name}
                      </S.LocationDropdownItem>
                    ))}
                  </S.LocationDropdown>
                )}
              </S.LocationWrapper>

              <S.HeaderText>의 경사로 데이터</S.HeaderText>
            </S.HeaderLeft>
            <S.MoreMenuWrapper>
              <S.IconButton type='button' onClick={handleToggleMoreMenu}>
                <MoreVertical size={24} />
              </S.IconButton>
              {isMoreMenuOpen && (
                <S.MoreMenu>
                  <S.MoreMenuItem type='button' onClick={handleDeleteSelected}>
                    삭제하기
                  </S.MoreMenuItem>
                </S.MoreMenu>
              )}
            </S.MoreMenuWrapper>
          </S.Header>

          <S.SearchSection>
            <S.SearchInputWrapper>
              <S.SearchInput
                placeholder='상호명으로 검색하세요...'
                value={localSearch}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
              />
              <S.SearchIconWrapper>
                <Search size={20} />
              </S.SearchIconWrapper>
            </S.SearchInputWrapper>

            <S.ActionButtons>
              <S.Button variant='outline'>공유</S.Button>
              <S.Button variant='outline'>
                <Filter size={20} />
                필터
              </S.Button>
              <S.Button variant='primary' onClick={() => navigate('/upload')}>
                <Plus size={20} />
                데이터 추가
              </S.Button>
            </S.ActionButtons>
          </S.SearchSection>

          {isLoadingData ? (
            <S.EmptyStateWrapper>
              <S.Spinner />
              <S.EmptyTitle>검색 중입니다...</S.EmptyTitle>
            </S.EmptyStateWrapper>
          ) : isErrorData ? (
            <S.EmptyStateWrapper>
              <S.EmptyTitle>데이터를 불러오는 중 오류가 발생했습니다.</S.EmptyTitle>
              <S.EmptySubtitle>잠시 후 다시 시도해 주세요.</S.EmptySubtitle>
            </S.EmptyStateWrapper>
          ) : paginatedData.length === 0 ? (
            <S.EmptyStateWrapper>
              <S.EmptyTitle>검색 결과가 없습니다.</S.EmptyTitle>
              <S.EmptySubtitle>검색어를 변경하거나 필터를 조정해 보세요.</S.EmptySubtitle>
            </S.EmptyStateWrapper>
          ) : (
            <S.TableContainer>
              <S.TableHeader>
                <S.CheckboxCell>
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) => checkedRows.includes(row.id))
                    }
                    onChange={toggleAllRows}
                  />
                </S.CheckboxCell>
                <S.TableHeaderCell width='220px'>
                  <S.HeaderText2>자치구명</S.HeaderText2>
                </S.TableHeaderCell>
                <S.TableHeaderCell width='220px'>
                  <S.FacilityFilterWrapper>
                    <S.FilterButton type='button' onClick={handleClickFacilityFilter}>
                      <S.HeaderText2>{selectedFacilityType}</S.HeaderText2>
                      <ChevronDown size={20} />
                    </S.FilterButton>

                    {isFacilityOpen && (
                      <S.LocationDropdown>
                        {facilityTypes.map((type: string) => (
                          <S.LocationDropdownItem
                            key={type}
                            active={type === selectedFacilityType}
                            onClick={() => handleSelectFacilityType(type)}
                          >
                            {type}
                          </S.LocationDropdownItem>
                        ))}
                      </S.LocationDropdown>
                    )}
                  </S.FacilityFilterWrapper>
                </S.TableHeaderCell>
                <S.TableHeaderCell flex>
                  <S.HeaderText2>상호명</S.HeaderText2>
                </S.TableHeaderCell>
                <S.TableHeaderCell flex>
                  <S.HeaderText2>주소</S.HeaderText2>
                </S.TableHeaderCell>
                <S.TableHeaderCell width='220px'>
                  <S.HeaderText2>경사로 폭</S.HeaderText2>
                </S.TableHeaderCell>
                <S.TableHeaderCell width='220px'>
                  <S.HeaderText2>업데이트 날짜</S.HeaderText2>
                </S.TableHeaderCell>
              </S.TableHeader>

              {paginatedData.map((row) => (
                <S.TableRow key={row.id}>
                  <S.CheckboxCell>
                    <Checkbox
                      checked={checkedRows.includes(row.id)}
                      onChange={() => toggleRowCheck(row.id)}
                    />
                  </S.CheckboxCell>
                  <S.TableCell width='220px'>
                    <S.CellText>{row.district}</S.CellText>
                  </S.TableCell>
                  <S.TableCell width='220px'>
                    <S.CellText>
                      {row.type || (row as unknown as { type?: string }).type || ''}
                    </S.CellText>
                  </S.TableCell>
                  <S.TableCell flex>
                    <S.CellText>{row.storeName}</S.CellText>
                  </S.TableCell>
                  <S.TableCell flex>
                    <S.CellText>{row.address}</S.CellText>
                  </S.TableCell>
                  <S.TableCell width='220px'>
                    <S.CellText>{row.rampWidth}</S.CellText>
                  </S.TableCell>
                  <S.TableCell width='220px'>
                    <S.CellText>{row.updateDate}</S.CellText>
                  </S.TableCell>
                </S.TableRow>
              ))}
            </S.TableContainer>
          )}

          <S.Pagination>
            <S.PageButton
              onClick={handlePrevRange}
              disabled={getCurrentRangeStart(currentPage) === 1}
            >
              «
            </S.PageButton>
            <S.PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
              ‹
            </S.PageButton>

            {paginationPages.map((page: number) => (
              <S.PageButton key={page} active={page === currentPage} onClick={() => goToPage(page)}>
                <S.PageNumber active={page === currentPage}>{page}</S.PageNumber>
              </S.PageButton>
            ))}

            <S.PageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
              ›
            </S.PageButton>
            <S.PageButton
              onClick={handleNextRange}
              disabled={getCurrentRangeStart(currentPage) + 10 > totalPages}
            >
              »
            </S.PageButton>
          </S.Pagination>
        </S.ContentSection>
      </S.PageContainer>
    </S.Wrapper>
  );
};
