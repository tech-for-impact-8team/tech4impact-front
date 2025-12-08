import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 40px;
  background: #f2f2f2;
  width: 100%;
  min-height: 100vh;
  overflow-x: auto; /* 화면이 더 좁으면 전체 레이아웃 기준으로 가로 스크롤 */
`;

export const PageContainer = styled.main`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 1400px; /* 큰 화면에서는 최대 1400px까지만 확장 */
  /* allow container to shrink on small screens */
  min-width: 0;
  margin: 0 auto; /* 가운데 정렬 */
  box-sizing: border-box;
`;

export const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #fefefe;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  margin: 20px;
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  align-items: start;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const LocationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 18px 8px 18px;
  background-color: #f4f9e4;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(244, 249, 228, 0.8);
  }
`;

export const LocationIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const LocationText = styled.span`
  font-family: 'Pretendard', Helvetica;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 140%;
  color: #1e1e1e;
`;

export const HeaderText = styled.span`
  color: #4c4c4c;
  font-family: 'Pretendard', Helvetica;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 140%;
  white-space: nowrap;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

export const SearchSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 12px;
  padding-right: 48px;
  background-color: #fafaf9;
  border-radius: 12px;
  border: 1px solid #e0e1e0;
  font-family: 'Pretendard', Helvetica;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 150%;

  &::placeholder {
    color: #999a99;
  }

  &:focus {
    outline: none;
    border-color: #90ce0c;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999a99;
`;

export const ActionButtons = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const Button = styled.button<{ variant?: 'outline' | 'primary' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: ${(props) => (props.variant === 'primary' ? '#c6ef52' : '#fefefe')};
  border-radius: 12px;
  border: ${(props) => (props.variant === 'primary' ? 'none' : '1px solid #e0e1e0')};
  font-family: 'Pretendard', Helvetica;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 150%;
  color: #1e1e1e;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.variant === 'primary' ? '#b0e030' : '#fafaf9')};
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;
  height: 47px;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

export const TableHeaderCell = styled.div<{ width?: string; flex?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 16px 20px;
  ${(props) => (props.flex ? 'flex: 1;' : '')}
  ${(props) => (props.width ? `width: ${props.width};` : '')}
`;

export const CheckboxCell = styled.div`
  display: inline-flex;
  height: 47px;
  align-items: center;
  gap: 5px;
  padding: 12px 8px;
`;

export const HeaderText2 = styled.span`
  font-family: 'Pretendard', Helvetica;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 150%;
  color: #4c4c4c;
  white-space: nowrap;
`;

export const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px 4px 12px;
  background-color: #f2f3f0;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e1e0;
  }
`;

export const TableRow = styled.div<{ highlighted?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid #f1f2f0;
  background-color: ${(props) => (props.highlighted ? '#f4f9e4' : '#fefefe')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.highlighted ? '#f4f9e4' : '#fafaf9')};
  }
`;

export const TableCell = styled.div<{ width?: string; flex?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 16px 20px;
  ${(props) => (props.flex ? 'flex: 1;' : '')}
  ${(props) => (props.width ? `width: ${props.width}; min-width: 0;` : 'min-width: 0;')}
`;

export const CellText = styled.span`
  font-family: 'Pretendard', Helvetica;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 150%;
  color: #1e1e1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; /* allow ellipsis within flex containers */
`;

export const Pagination = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 20px;
`;

export const PaginationDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const Dot = styled.div`
  width: 4px;
  height: 4px;
  background-color: #bfc2be;
  border-radius: 2px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: ${(props) => (props.active ? '1' : '0.6')};

  &:hover {
    opacity: 1;
  }
`;

export const PageNumber = styled.span<{ active?: boolean }>`
  font-family: 'Pretendard', Helvetica;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.24px;
  line-height: 150%;
  color: ${(props) => (props.active ? '#1e1e1e' : '#999a99')};
`;

export const CheckboxWrapper = styled.div<{ checked?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) => (props.checked ? '#4d8b2a' : '#ffffff')};
  border: ${(props) => (props.checked ? '1px solid #4d8b2a' : '1.5px solid #90ce0c')};

  &:hover {
    background-color: ${(props) => (props.checked ? '#437824' : '#f4f9e4')};
  }
`;

export const LocationWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const LocationDropdown = styled.ul`
  position: absolute;
  top: 44px;
  left: 0;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0e1e0;
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.08);
  min-width: 160px;
  z-index: 10;

  max-height: 260px; /* 드롭다운 최대 높이 제한 */
  overflow-y: auto; /* 내용이 넘치면 세로 스크롤 */
`;

export const LocationDropdownItem = styled.li<{ active?: boolean }>`
  padding: 8px 16px;
  font-family: 'Pretendard', Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.28px;
  line-height: 150%;
  color: #1e1e1e;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#f4f9e4' : 'transparent')};

  &:hover {
    background-color: #f4f9e4;
  }
`;

export const FacilityFilterWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const MoreMenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const MoreMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 120px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  z-index: 20;
`;

export const MoreMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #f04438; /* "삭제하기" 텍스트 색 (빨간색) */
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const EmptyStateWrapper = styled.div`
  width: 100%;
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6b6b6b;
`;

export const EmptyTitle = styled.div`
  font-family: 'Pretendard', Helvetica;
  font-size: 16px;
  font-weight: 700;
  color: #2b2b2b;
`;

export const EmptySubtitle = styled.div`
  font-family: 'Pretendard', Helvetica;
  font-size: 14px;
  color: #8f8f8f;
`;

export const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #90ce0c;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
