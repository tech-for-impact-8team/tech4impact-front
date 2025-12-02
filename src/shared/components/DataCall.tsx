import { useState } from 'react';

// -----------------------------------------------------------------------------
// Dummy data generation (테이블에 뿌릴 더미 데이터 정의/생성 구간)
// -----------------------------------------------------------------------------
//
// Data types
// ※ RampApi: 실제 API 응답 형태(라고 가정한 타입)
// ※ TableRow: 화면(UI)에서 사용하는 형태 (체크 여부 등 UI 전용 필드 포함)
//    └ 나중에 실제 API를 붙일 때는, RampApi 타입과 아래 매핑 함수만 수정하면
//      나머지 필터/페이지네이션/체크박스 로직은 그대로 재사용할 수 있도록 설계.

export type RampApi = {
  id: number;
  district: string;
  facilityType: string;
  storeName: string;
  address: string;
  rampWidth: string;
  updateDate: string;
};

export type TableRow = RampApi & {
  // UI 상태(체크 여부 등)를 위해 API 응답에 추가로 붙는 필드
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

const facilityTypeOptions = ['시설 유형 A', '시설 유형 B', '시설 유형 C'];

// 2024-01-01 ~ 2025-12-31 범위에서 랜덤 날짜 문자열(YYYY.MM.DD)을 생성하는 유틸 함수
const randomDateString = (): string => {
  const start = new Date(2024, 0, 1).getTime(); // 2024-01-01
  const end = new Date(2025, 11, 31).getTime(); // 2025-12-31
  const timestamp = start + Math.random() * (end - start);
  const d = new Date(timestamp);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

// 실제 API 대신 사용하는 더미 API 응답 데이터 (개발용 목업 데이터)
export const mockApiData: RampApi[] = (() => {
  const rows: RampApi[] = [];
  const maxRows = 120;
  const basePerDistrict = 5;
  let id = 1;

  outer: for (const district of seoulDistricts) {
    for (let i = 0; i < basePerDistrict; i++) {
      if (rows.length >= maxRows) {
        break outer;
      }

      rows.push({
        id,
        district,
        facilityType: facilityTypeOptions[(id - 1) % facilityTypeOptions.length],
        storeName: `상호명 ${id}`,
        address: `주소가 들어갑니다 ${id}`,
        rampWidth: '경사로 폭',
        updateDate: randomDateString(),
      });

      id += 1;
    }
  }

  return rows;
})();

// -----------------------------------------------------------------------------
// Dummy data generation 끝
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// API → UI 매핑 레이어
// -----------------------------------------------------------------------------
// - API 응답(RampApi)을 화면에서 사용할 TableRow 형태로 변환하는 함수
// - 이 함수(mapRampApiToTableRow)는 "API에서 받은 데이터(RampApi)"를
//   화면에서 사용하는 형태(TableRow)로 변환하는 역할만 담당합니다.
// - 나중에 실제 API 스펙이 바뀌면 아래 두 가지만 수정하면 됩니다.
//   1) RampApi 타입 정의 (필드 이름, 타입 등)
//   2) mapRampApiToTableRow 함수 내부에서 TableRow로 매핑하는 부분
// - 그 외의 필터/페이지네이션/체크박스/드롭다운 로직은 모두 TableRow를 기준으로
//   동작하므로, 이 레이어만 잘 유지하면 나머지 코드는 건드릴 필요가 없습니다.
export const mapRampApiToTableRow = (api: RampApi): TableRow => ({
  // 여기서 API 응답 필드(RampApi)를 화면에서 쓸 필드(TableRow)로 변환합니다.
  // 예: 실제 API가 districtCode, facility_type 같은 필드명을 쓴다면
  //     그 값을 사람이 읽기 좋은 문자열로 가공해서 넣는 자리입니다.
  //
  //   return {
  //     id: Number(api.rampId),
  //     district: convertCodeToDistrictName(api.sigunguCode),
  //     facilityType: mapFacilityCodeToLabel(api.facility_type),
  //     storeName: api.name,
  //     address: api.roadAddress,
  //     rampWidth: `${api.width_m.toFixed(1)} m`,
  //     updateDate: formatDate(api.updated_at),
  //     checked: false,
  //   };
  //
  // 지금은 더미데이터(mockApiData)의 필드명이 TableRow와 동일하다고 가정하므로
  // 스프레드 연산자로 그대로 복사한 뒤 checked만 추가합니다.
  ...api,
  checked: false,
});
// 경사로 테이블에 사용할 데이터를 제공하는 훅
// - 지금은 mockApiData를 사용하지만, 나중에 실제 API 호출로 교체 예정
// - 이 훅만 실제 통신 로직으로 바꾸면, 아래 DataPage UI 로직은 그대로 유지 가능
export const useRampApiData = (): TableRow[] => {
  // 현재는 mockApiData를 바로 사용하는 개발용 훅입니다.
  // 나중에 실제 API를 붙일 때는 이 훅 내부를 fetch/axios 호출로 교체하면 됩니다.
  const [tableData] = useState<TableRow[]>(() => mockApiData.map(mapRampApiToTableRow));
  return tableData;
};
