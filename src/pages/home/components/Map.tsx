import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

import { useRampMarkers } from '@app/api/hooks/rampHooks';

// 네이버 지도 타입 선언 (간단하게 any로 선언, 나중에 필요하면 타입 좁힐 수 있음)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}
type MapProps = {
  onAddressChange?: (address: string) => void;
  // 로그인 상태일 때만 실제 위치 정보를 사용하도록 제어
  enableGeolocation?: boolean;
};
const NAVER_MAP_SCRIPT_ID = 'naver-map-sdk';

export const Map = ({ onAddressChange, enableGeolocation = true }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // 지도 인스턴스 ref
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const permissionAskedRef = useRef(false);

  const locateUser = (map: any) => {
    const { naver } = window;

    // 상위에서 geolocation 사용 여부를 제어
    if (!enableGeolocation) {
      console.log('geolocation 비활성화 상태입니다. 기본 위치만 사용합니다.');
      return;
    }

    if (!('geolocation' in navigator)) {
      console.warn('이 브라우저는 Geolocation API를 지원하지 않습니다. 기본 위치만 표시합니다.');
      return;
    }

    console.log('브라우저에서 Geolocation API를 지원합니다. 현재 위치를 요청합니다.');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('현재 위치 수신 성공:', latitude, longitude);
        const userLocation = new naver.maps.LatLng(latitude, longitude);
        map.setCenter(userLocation);

        // 좌표를 행정동 주소로 변환 (reverse geocode)
        try {
          if (!naver.maps || !naver.maps.Service) {
            console.warn('naver.maps.Service 가 준비되지 않았습니다.');
          } else {
            console.log('reverseGeocode 요청 시작 (초기 위치)');
            naver.maps.Service.reverseGeocode(
              {
                coords: userLocation,
                orders: [
                  naver.maps.Service.OrderType.ADDR,
                  naver.maps.Service.OrderType.ROAD_ADDR,
                ].join(','),
              },
              (status: number, response: any) => {
                console.log('reverseGeocode 콜백 (초기 위치)', status, response);
                if (status !== naver.maps.Service.Status.OK) {
                  console.error('reverseGeocode 실패:', status, response);
                  return;
                }
                const v2 = response?.v2;
                if (!v2) {
                  console.warn('reverseGeocode 응답에 v2가 없습니다.', response);
                  return;
                }

                const items = v2.results ?? [];
                if (!items.length) {
                  console.warn('reverseGeocode 결과가 없습니다.', v2);
                  return;
                }

                const region = items[0].region ?? {};
                const area1 = region.area1 ?? {};
                const area2 = region.area2 ?? {};
                const area3 = region.area3 ?? {};

                const sido = area1.name ?? '';
                const sigugun = area2.name ?? '';
                const dongmyun = area3.name ?? '';

                const label = [sido, sigugun, dongmyun].filter(Boolean).join(' ');
                console.log('현재 위치 주소(label):', label);

                if (onAddressChange && label) {
                  onAddressChange(label);
                }
              },
            );
          }
        } catch (e) {
          console.error('reverseGeocode 호출 중 예외 발생:', e);
        }
      },
      (error) => {
        console.error('현재 위치 가져오기 실패:', error);
        // 실패 시에는 기본 중심만 유지
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const { data: rampMarkers } = useRampMarkers();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = () => {
      const { naver } = window;
      console.log('initializeMap called, naver:', naver);

      if (!naver || !naver.maps) {
        console.error('네이버 지도 객체를 찾을 수 없습니다. 스크립트 로드 상태를 확인하세요.');
        return;
      }

      const center = new naver.maps.LatLng(37.5665, 126.978); // 서울 시청 근처

      const options = {
        center,
        zoom: 15,
        // 아래 두 옵션은 나중에 Style Editor 사용 시 활성화
        // gl: true,
        // customStyleId: import.meta.env.VITE_NAVER_MAP_STYLE_ID,
      };

      const map = new naver.maps.Map(mapContainerRef.current as HTMLElement, options);
      console.log('네이버 지도 객체 생성 완료:', map);

      mapRef.current = map;

      // 기본 위치(서울 시청)를 먼저 보여줍니다.
      // 실제 현재 위치로 이동하는 로직은 enableGeolocation 변경을 감지하는 useEffect에서 수행됩니다.
    };

    // 이미 naver.maps 객체가 존재하면 바로 초기화
    if (window.naver && window.naver.maps) {
      initializeMap();
      return;
    }

    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID) as HTMLScriptElement | null;

    if (!existingScript) {
      console.log('네이버 지도 스크립트가 없어 새로 생성합니다.');
      const script = document.createElement('script');
      script.id = NAVER_MAP_SCRIPT_ID;

      const keyId = import.meta.env.VITE_NAVER_MAP_KEY_ID;
      if (!keyId) {
        console.error(
          '네이버 지도 Key ID(VITE_NAVER_MAP_KEY_ID)가 설정되지 않았습니다. .env 파일을 확인하세요.',
        );
        return;
      }

      // 최신 가이드: ncpKeyId 파라미터 사용
      // 참고: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${keyId}&submodules=geocoder`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('네이버 지도 스크립트 로드 완료(onload 호출)');
        initializeMap();
      };
      script.onerror = (e) => {
        console.error('네이버 지도 스크립트 로드 실패(onerror 호출)', e);
      };
      document.head.appendChild(script);
      console.log('네이버 지도 스크립트 태그를 head에 appendChild 했습니다.');
    } else {
      console.log('기존 네이버 지도 스크립트가 존재합니다. onload에 initializeMap을 연결합니다.');
      existingScript.onload = () => {
        console.log('기존 네이버 지도 스크립트 onload 호출');
        initializeMap();
      };
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const { naver } = window;

    if (!map || !naver || !naver.maps) return;

    // geolocation 비활성화 시: 권한 안내 플래그를 리셋하고 기본 위치로 이동
    if (!enableGeolocation) {
      permissionAskedRef.current = false;
      const defaultCenter = new naver.maps.LatLng(37.5665, 126.978); // 서울 시청 근처
      map.setCenter(defaultCenter);
      return;
    }

    // geolocation 활성화 시: 현재 위치 요청
    locateUser(map);
  }, [enableGeolocation]);

  useEffect(() => {
    const map = mapRef.current;
    const { naver } = window;

    if (!map || !naver || !naver.maps) return;
    if (!Array.isArray(rampMarkers) || rampMarkers.length === 0) return;

    console.log('[Map] rampMarkers for map rendering:', rampMarkers);
    // 기존 마커가 있으면 지도에서 제거
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((m) => {
        try {
          m.setMap(null);
        } catch {
          // ignore
        }
      });
      markersRef.current = [];
    }

    // 새 마커 생성
    const nextMarkers: any[] = [];
    rampMarkers.forEach((marker) => {
      if (
        typeof marker.latitude !== 'number' ||
        typeof marker.longitude !== 'number' ||
        Number.isNaN(marker.latitude) ||
        Number.isNaN(marker.longitude)
      ) {
        return;
      }

      const position = new naver.maps.LatLng(marker.latitude, marker.longitude);
      const m = new naver.maps.Marker({
        position,
        map,
      });
      nextMarkers.push(m);
    });

    markersRef.current = nextMarkers;
  }, [rampMarkers]);

  const handleMyLocationClick = () => {
    const map = mapRef.current;
    const { naver } = window;

    if (!enableGeolocation) {
      alert('로그인 후 내 위치 기능을 사용할 수 있습니다.');
      return;
    }

    if (!map || !naver || !naver.maps) {
      console.warn('지도나 네이버 객체가 아직 초기화되지 않았습니다.');
      return;
    }

    // 현재 지도에서 다시 사용자 위치를 요청
    if (!('geolocation' in navigator)) {
      console.warn('이 브라우저는 Geolocation API를 지원하지 않습니다.');
      return;
    }

    console.log('내 위치 버튼 클릭 - 현재 위치 요청');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('내 위치 버튼 - 위치 수신 성공:', latitude, longitude);
        const userLocation = new naver.maps.LatLng(latitude, longitude);
        map.setCenter(userLocation);

        try {
          if (!naver.maps || !naver.maps.Service) {
            console.warn('naver.maps.Service 가 준비되지 않았습니다.(내 위치 버튼)');
          } else {
            console.log('reverseGeocode 요청 시작 (내 위치 버튼)');
            naver.maps.Service.reverseGeocode(
              {
                coords: userLocation,
                orders: [
                  naver.maps.Service.OrderType.ADDR,
                  naver.maps.Service.OrderType.ROAD_ADDR,
                ].join(','),
              },
              (status: number, response: any) => {
                console.log('reverseGeocode 콜백 (내 위치 버튼)', status, response);
                if (status !== naver.maps.Service.Status.OK) {
                  console.error('reverseGeocode 실패(내 위치 버튼):', status, response);
                  return;
                }
                const v2 = response?.v2;
                if (!v2) {
                  console.warn('reverseGeocode 응답에 v2가 없습니다.(내 위치 버튼)', response);
                  return;
                }

                const items = v2.results ?? [];
                if (!items.length) {
                  console.warn('reverseGeocode 결과가 없습니다.(내 위치 버튼)', v2);
                  return;
                }

                const region = items[0].region ?? {};
                const area1 = region.area1 ?? {};
                const area2 = region.area2 ?? {};
                const area3 = region.area3 ?? {};

                const sido = area1.name ?? '';
                const sigugun = area2.name ?? '';
                const dongmyun = area3.name ?? '';

                const label = [sido, sigugun, dongmyun].filter(Boolean).join(' ');
                console.log('내 위치 버튼 주소(label):', label);

                if (onAddressChange && label) {
                  onAddressChange(label);
                }
              },
            );
          }
        } catch (e) {
          console.error('reverseGeocode 호출 중 예외 발생(내 위치 버튼):', e);
        }
      },
      (error) => {
        console.error('내 위치 버튼 - 위치 가져오기 실패:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <MapWrapper>
      <MapContainer ref={mapContainerRef} />
      <MyLocationButton type='button' onClick={handleMyLocationClick}>
        <MyLocationIcon viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='3' />
          <path d='M12 4V2' />
          <path d='M12 22v-2' />
          <path d='M4 12H2' />
          <path d='M22 12h-2' />
          <circle cx='12' cy='12' r='8' fill='none' />
        </MyLocationIcon>
      </MyLocationButton>
    </MapWrapper>
  );
};

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const MyLocationButton = styled.button`
  position: absolute;
  right: 16px;
  bottom: 32px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  }
`;

const MyLocationIcon = styled.svg`
  width: 22px;
  height: 22px;
  stroke: #20a07a;
  stroke-width: 1.8;
  fill: #20a07a22;
  stroke-linecap: round;
  stroke-linejoin: round;
`;
