import styled from '@emotion/styled';
import { DataPage } from '@shared/components/DataPage.tsx';
import { Map } from '../components/Map.tsx';
import { useState, useEffect } from 'react';
import { useMe } from '@app/api/hooks/userHooks';

export const HomePage = () => {
  const DEFAULT_LOCATION_LABEL = '서울특별시 중구 세종대로';

  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION_LABEL);
  const { data: me, isError } = useMe();
  const isLoggedIn = !!me && !isError;

  // 로그인 해제 시 위치 라벨을 기본 값으로 되돌리기
  useEffect(() => {
    if (!isLoggedIn) {
      setLocationLabel(DEFAULT_LOCATION_LABEL);
    }
  }, [isLoggedIn]);

  return (
    <Wrapper>
      <MainSection>
        {/* 상단: 우리 동네 경사로 지도 카드 */}
        <MapCard>
          <MapHeader>
            <MapTitle>우리 동네 경사로 지도</MapTitle>
            <MapSubtitle>{locationLabel}</MapSubtitle>
          </MapHeader>
          <MapArea>
            <Map enableGeolocation={isLoggedIn} onAddressChange={setLocationLabel} />
          </MapArea>
        </MapCard>
      </MainSection>
      {/* 하단: 경사로 데이터 테이블 - DataPage 재사용 */}
      <DataPage pageSize={10} />
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;
