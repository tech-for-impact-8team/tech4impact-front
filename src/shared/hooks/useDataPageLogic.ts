import { useEffect, useMemo, useState } from 'react';
import type { TableRow } from '@shared/components/DataCall.ts';
import { useRamps } from '@app/api/hooks/rampHooks';
import type { RampsApiResponse } from '@app/api/hooks/rampHooks';
import { useDeleteRamps } from '@app/api/hooks/rampMutations';

// date helpers at module scope so hooks don't need to include them in deps
const pad2 = (n: number) => String(n).padStart(2, '0');
const formatToKoreanDate = (v?: string): string => {
  if (!v) return '';
  const numericDot = /^\s*(\d{4})\.(\d{1,2})\.(\d{1,2})\s*$/;
  const numericDash = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})/;
  const mDot = v.match(numericDot);
  if (mDot) {
    const y = Number(mDot[1]);
    const mo = Number(mDot[2]);
    const d = Number(mDot[3]);
    return `${y}년 ${pad2(mo)}월 ${pad2(d)}일`;
  }
  const mDash = v.match(numericDash);
  if (mDash) {
    const y = Number(mDash[1]);
    const mo = Number(mDash[2]);
    const d = Number(mDash[3]);
    return `${y}년 ${pad2(mo)}월 ${pad2(d)}일`;
  }

  const parsed = new Date(v);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const mo = parsed.getMonth() + 1;
    const d = parsed.getDate();
    return `${y}년 ${pad2(mo)}월 ${pad2(d)}일`;
  }

  return '';
};

// 서버 기반 DataPage 상태/로직 훅
export const useDataPageLogic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [order, setOrder] = useState<'ASC' | 'DESC' | string>('DESC');
  const [filterDistrict, setFilterDistrict] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useRamps(
    {
      page: currentPage,
      take: pageSize,
      order_createdAt: order,
      where__district: filterDistrict,
      where__type: filterType,
      where__query: searchQuery,
    },
    { enabled: true },
  );

  const [tableData, setTableData] = useState<TableRow[]>([]);

  useEffect(() => {
    // data is typed as RampsApiResponse from the hook
    const apiData = data as RampsApiResponse | undefined;
    if (!apiData || !Array.isArray(apiData.data)) {
      setTableData([]);
      return;
    }

    type RampItem = {
      id?: number;
      district?: string;
      type?: string;
      storeName?: string;
      tradeName?: string;
      name?: string;
      address?: string;
      rampWidth?: string;
      width?: string;
      updateDate?: string;
      updatedAt?: string;
    };

    const rows = apiData.data.map((rawItem, idx) => {
      const item = rawItem as RampItem;
      const id = typeof item.id === 'number' ? item.id : idx + 1;
      const district = item.district ?? '';
      const type = item.type ?? '';
      const storeName = item.storeName ?? item.tradeName ?? item.name ?? '';
      const address = item.address ?? '';
      const rampWidth = item.rampWidth ?? item.width ?? '';
      const updateDateStr = item.updateDate ?? item.updatedAt ?? '';
      const updateDate = formatToKoreanDate(updateDateStr);

      return {
        id,
        district,
        type,
        storeName,
        address,
        rampWidth,
        updateDate,
        checked: false,
      } as TableRow;
    });

    setTableData(rows);
  }, [data, formatToKoreanDate]);

  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const [selectedLocation, setSelectedLocation] = useState('서울특별시');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState('시설 유형');
  const [isFacilityOpen, setIsFacilityOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const districtOptions = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row: TableRow) => {
      if (row.district) set.add(row.district);
    });
    const uniqueDistricts = Array.from(set);
    uniqueDistricts.sort();
    return ['서울특별시', ...uniqueDistricts];
  }, [tableData]);

  const facilityTypes = useMemo(() => {
    const set = new Set<string>();
    tableData.forEach((row: TableRow) => {
      if (row.type) set.add(row.type);
    });
    const uniqueTypes = Array.from(set);
    uniqueTypes.sort();
    return ['시설 유형', ...uniqueTypes];
  }, [tableData]);

  // totalPages: prefer data.totalPages; if server only returns total count, compute pages based on pageSize
  const totalItems = (data as RampsApiResponse | undefined)?.total;
  const totalPages =
    data?.totalPages ??
    (typeof totalItems === 'number' ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1);

  // paginatedData: if server returns the entire dataset (data.length === totalItems), do client-side pagination
  let paginatedData: TableRow[] = tableData;
  const serverDataLength = (data as RampsApiResponse | undefined)?.data?.length ?? tableData.length;
  if (typeof totalItems === 'number' && serverDataLength === totalItems) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    paginatedData = tableData.slice(start, end);
  }
  const isLoadingData = isLoading;
  const isErrorData = isError;

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

  const goToPage = (page: number) => {
    if (totalPages === 0) return;
    const safePage = Math.min(Math.max(1, page), totalPages);
    setCheckedRows([]);
    setCurrentPage(safePage);
  };

  const toggleRowCheck = (id: number) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

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

  const deleteRampsMutation = useDeleteRamps();

  const handleDeleteSelected = () => {
    if (checkedRows.length === 0) return;

    // call delete mutation with selected ids
    deleteRampsMutation.mutate(checkedRows, {
      onSuccess: () => {
        setCheckedRows([]);
        setIsMoreMenuOpen(false);
      },
      onError: () => {
        // keep selection so user can retry; optionally show notification
      },
    });
  };

  const handleToggleMoreMenu = () => {
    setIsMoreMenuOpen((prev) => !prev);
  };

  const handleClickLocation = () => {
    setIsLocationOpen((prev) => !prev);
  };

  const handleSelectDistrict = (name: string) => {
    setSelectedLocation(name);
    setFilterDistrict(name === '서울특별시' ? undefined : name);
    setIsLocationOpen(false);
    setCurrentPage(1);
    setCheckedRows([]);
  };

  const handleClickFacilityFilter = () => {
    setIsFacilityOpen((prev) => !prev);
  };

  const handleSelectFacilityType = (type: string) => {
    setSelectedFacilityType(type);
    setFilterType(type === '시설 유형' ? undefined : type);
    setIsFacilityOpen(false);
    setCurrentPage(1);
    setCheckedRows([]);
  };

  const getCurrentRangeStart = (page: number) => Math.floor((page - 1) / 10) * 10 + 1;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrevRange = () => {
    const rangeStart = getCurrentRangeStart(currentPage);
    if (rangeStart === 1) return;
    const prevRangeStart = Math.max(rangeStart - 10, 1);
    goToPage(prevRangeStart);
  };

  const handleNextRange = () => {
    const rangeStart = getCurrentRangeStart(currentPage);
    const nextRangeStart = rangeStart + 10;
    if (nextRangeStart > totalPages) return;
    goToPage(nextRangeStart);
  };

  return {
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
    getCurrentRangeStart,
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
    isLoadingData,
    isErrorData,
    setPageSize,
    setOrder,
    setSearchQuery,
  };
};
