import { useState } from 'react';

export type RampApi = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  district?: string;
  type?: string; // server-provided field
  address?: string;
  tradeName?: string;
  width?: string;
  latitude?: number | null;
  longitude?: number | null;
  images?: unknown[];
};

export type TableRow = {
  id: number;
  district: string;
  // use server `type` field directly
  type?: string;
  storeName: string;
  address: string;
  rampWidth: string;
  updateDate: string;
  checked: boolean;
};

const seoulDistricts: string[] = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
];

const typeOptions = ['식당', '상점', '의료기관'];

const randomDateString = (): string => {
  const start = new Date(2024, 0, 1).getTime();
  const end = new Date(2025, 11, 31).getTime();
  const timestamp = start + Math.random() * (end - start);
  const d = new Date(timestamp);
  return d.toISOString();
};

export const mockApiData: RampApi[] = (() => {
  const rows: RampApi[] = [];
  const maxRows = 120;
  const basePerDistrict = 5;
  let id = 1;

  outer: for (const district of seoulDistricts) {
    for (let i = 0; i < basePerDistrict; i++) {
      if (rows.length >= maxRows) break outer;

      rows.push({
        id,
        createdAt: randomDateString(),
        updatedAt: randomDateString(),
        district,
        type: typeOptions[(id - 1) % typeOptions.length],
        address: `서울시 ${district} 번지 ${id}`,
        tradeName: `상호명 ${id}`,
        width: (1 + (id % 5) * 0.25).toFixed(2),
        latitude: 37.5 + Math.random() * 0.5,
        longitude: 126.9 + Math.random() * 0.5,
        images: [],
      });

      id += 1;
    }
  }

  return rows;
})();

export const mapRampApiToTableRow = (api: RampApi): TableRow => {
  const id = api.id;
  const district = api.district ?? '';
  const type = api.type ?? '';
  const storeName = api.tradeName ?? '';
  const address = api.address ?? '';
  const rampWidth = api.width ?? '';
  const rawDate = api.updatedAt ?? api.createdAt ?? '';

  const formatDate = (v: string) => {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}년 ${mo}월 ${day}일`;
  };

  return {
    id,
    district,
    type,
    storeName,
    address,
    rampWidth,
    updateDate: formatDate(rawDate),
    checked: false,
  };
};

export const useRampApiData = (): TableRow[] => {
  const [tableData] = useState<TableRow[]>(() => mockApiData.map(mapRampApiToTableRow));
  return tableData;
};
