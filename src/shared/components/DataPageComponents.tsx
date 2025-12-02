import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import * as S from './DataPage.styles';
import { useRampApiData } from './DataCall';
import type { TableRow } from './DataCall';

// 공용 체크박스 컴포넌트
// - checked: 선택 여부
// - onChange: 클릭 시 호출되는 핸들러 (헤더/행 체크박스에서 공통으로 사용)
export type CheckboxProps = {
  checked?: boolean;
  onChange?: () => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <S.CheckboxWrapper checked={checked} onClick={onChange}>
      {checked && <Check size={16} color='#90ce0c' />}
    </S.CheckboxWrapper>
  );
};

// DataPage 전용 상태/필터/페이지네이션 로직을 모아 둔 커스텀 훅
// - DataPage.tsx에서는 이 훅을 호출해서 UI에 필요한 값과 핸들러만 가져다 씁니다.
export const useDataPageLogic = () => {
  const tableDataFromApi = useRampApiData();
  const [tableData, setTableData] = useState<TableRow[]>(tableDataFromApi);

  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const PAGE_SIZE = 10; // 페이지당 보여줄 데이터수
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedLocation, setSelectedLocation] = useState('서울특별시');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState('시설 유형');
  const [isFacilityOpen, setIsFacilityOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // API/테이블 데이터에서 자치구 목록을 추출하여 필터 옵션으로 사용
  // - 첫 번째 항목 "서울특별시"는 '전체 지역'을 의미하는 특별 옵션
  const districtOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row: TableRow) => {
      if (row.district) set.add(row.district);
    });
    const uniqueDistricts = Array.from(set);
    uniqueDistricts.sort();
    return ['서울특별시', ...uniqueDistricts];
  }, [tableData]);

  // API/테이블 데이터에서 시설 유형 목록을 추출하여 필터 옵션으로 사용
  // - 첫 번째 항목 "시설 유형"은 '전체 시설 유형'을 의미하는 특별 옵션
  const facilityTypes = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row: TableRow) => {
      if (row.facilityType) set.add(row.facilityType);
    });
    const uniqueTypes = Array.from(set);
    uniqueTypes.sort();
    return ['시설 유형', ...uniqueTypes];
  }, [tableData]);

  // 선택된 지역/시설 유형 필터를 적용한 결과 데이터
  const filteredData = tableData.filter((row) => {
    const matchLocation = selectedLocation === '서울특별시' || row.district === selectedLocation;
    const matchFacility =
      selectedFacilityType === '시설 유형' || row.facilityType === selectedFacilityType;
    return matchLocation && matchFacility;
  });

  // 필터된 데이터 기준 전체 페이지 수
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  // 현재 페이지에 표시할 데이터 (클라이언트 페이지네이션)
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // 현재 페이지를 기준으로 10개 단위 페이지 번호 목록을 계산하는 함수
  const getPaginationPages = (current: number, total: number): number[] => {
    if (total === 0) return [];

    const rangeIndex = Math.floor((current - 1) / 10);
    const rangeStart = rangeIndex * 10 + 1;
    const rangeEnd = Math.min(rangeStart + 9, total);

    const pages: number[] = [];
    for (let p = rangeStart; p <= rangeEnd; p += 1) {
      pages.push(p);
    }
    return pages;
  };

  const paginationPages = getPaginationPages(currentPage, totalPages);

  // 지정한 페이지로 이동하면서 선택된 행(체크박스) 상태를 초기화하는 함수
  const goToPage = (page: number) => {
    if (totalPages === 0) return;

    const safePage = Math.min(Math.max(1, page), totalPages);
    setCheckedRows([]);
    setCurrentPage(safePage);
  };

  // 개별 행의 체크 상태를 토글하는 함수
  const toggleRowCheck = (id: number) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  // 현재 페이지에 표시된 행들을 한 번에 선택/해제하는 함수
  const toggleAllRows = () => {
    const visibleIds = paginatedData.map((row) => row.id);

    setCheckedRows((prev) => {
      const allVisibleChecked = visibleIds.every((id) => prev.includes(id));

      if (allVisibleChecked) {
        return prev.filter((id) => !visibleIds.includes(id));
      }

      const next = new Set(prev);
      visibleIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  // 체크된 행들을 데이터에서 삭제하는 핸들러
  const handleDeleteSelected = () => {
    if (checkedRows.length === 0) return;

    setTableData((prev) => {
      // 1) 실제 데이터 삭제
      const next = prev.filter((row) => !checkedRows.includes(row.id));

      // 2) 삭제 이후 현재 필터(지역/시설 유형)를 적용한 데이터 기준으로
      //    전체 페이지 수를 다시 계산해서, currentPage가 유효 범위 안에 있도록 조정
      const filteredAfterDelete = next.filter((row) => {
        const matchLocation =
          selectedLocation === '서울특별시' || row.district === selectedLocation;
        const matchFacility =
          selectedFacilityType === '시설 유형' || row.facilityType === selectedFacilityType;
        return matchLocation && matchFacility;
      });

      const newTotalPages = Math.ceil(filteredAfterDelete.length / PAGE_SIZE);

      setCurrentPage((prevPage) => {
        if (newTotalPages === 0) return 1;
        return Math.min(prevPage, newTotalPages);
      });

      return next;
    });

    setCheckedRows([]);
    setIsMoreMenuOpen(false);
  };

  // 우측 상단 더보기(햄버거) 메뉴 열기/닫기 토글 핸들러
  const handleToggleMoreMenu = () => {
    setIsMoreMenuOpen((prev) => !prev);
  };

  // 지역(자치구) 드롭다운 열기/닫기 토글 핸들러
  const handleClickLocation = () => {
    setIsLocationOpen((prev) => !prev);
  };

  // 특정 자치구를 선택했을 때 필터 상태를 변경하고 페이지/선택을 초기화하는 핸들러
  const handleSelectDistrict = (name: string) => {
    setSelectedLocation(name);
    setIsLocationOpen(false);
    setCurrentPage(1);
    setCheckedRows([]);
  };

  // 시설 유형 드롭다운 열기/닫기 토글 핸들러
  const handleClickFacilityFilter = () => {
    setIsFacilityOpen((prev) => !prev);
  };

  // 특정 시설 유형을 선택했을 때 필터 상태를 변경하고 페이지/선택을 초기화하는 핸들러
  const handleSelectFacilityType = (type: string) => {
    setSelectedFacilityType(type);
    setIsFacilityOpen(false);
    setCurrentPage(1);
    setCheckedRows([]);
  };

  // 현재 페이지가 속한 10개 단위 페이지 범위의 시작 번호를 계산하는 함수
  const getCurrentRangeStart = (page: number) => Math.floor((page - 1) / 10) * 10 + 1;

  // 이전 페이지로 이동하는 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동하는 핸들러
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // 이전 10페이지 범위(블록)로 점프하는 핸들러
  const handlePrevRange = () => {
    const rangeStart = getCurrentRangeStart(currentPage);
    if (rangeStart === 1) return;
    const prevRangeStart = Math.max(rangeStart - 10, 1);
    goToPage(prevRangeStart);
  };

  // 다음 10페이지 범위(블록)로 점프하는 핸들러
  const handleNextRange = () => {
    const rangeStart = getCurrentRangeStart(currentPage);
    const nextRangeStart = rangeStart + 10;
    if (nextRangeStart > totalPages) return;
    goToPage(nextRangeStart);
  };

  return {
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
  };
};
