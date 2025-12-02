import styled from '@emotion/styled';
import { DataPage } from '@shared/components/DataPage.tsx';

export const HomePage = () => {
  return (
    <Wrapper>
      <MainSection>
        {/* 상단: 우리 동네 경사로 지도 카드 */}
        <MapCard>
          <MapHeader>
            <MapTitle>우리 동네 경사로 지도</MapTitle>
            <MapSubtitle>서울특별시 00구 00동</MapSubtitle>
          </MapHeader>

          {/* 지도 영역 (API 연동 예정) */}
          <MapArea>지도 영역 (API 연동 예정)</MapArea>
        </MapCard>
      </MainSection>
      {/* 하단: 경사로 데이터 테이블 - DataPage 재사용 */}
      <DataPage />
    </Wrapper>
  );
};

/* ===== styled components ===== */

const Wrapper = styled.div`
  padding: 40px 0;
  background: #f2f2f2;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
`;

const MainSection = styled.div`
  width: 100%;
  max-width: 1400px; /* DataPage 카드 폭과 맞추기 위한 고정 최대 폭 */
  margin: 0 auto;
  //padding: 0 40px;    /* 좌우 여백은 여기서 처리 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const MapCard = styled.section`
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MapHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MapTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e1e1e;
`;

const MapSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #777876;
`;

const MapArea = styled.div`
  margin-top: 12px;
  height: 420px;
  border-radius: 16px;
  background-color: #e4e5e2; /* 지도 자리 회색 박스 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777876;
  font-size: 14px;
  font-weight: 500;
`;
