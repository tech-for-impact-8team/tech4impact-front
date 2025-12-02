import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MyPage() {
  // -------------------------------
  // 더미 데이터 & 선택 상태 관리
  // -------------------------------
  // TODO: API 데이터로 교체 필요 (현재는 더미 데이터)
  const dummyData = [...Array(10)].map((_, i) => ({ id: i + 1 }));
  const [selected, setSelected] = useState<number[]>([]);

  // 개별 체크박스 클릭 시 선택/해제
  const toggleOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // 상단(전체 선택) 체크박스 클릭 시 전체 선택/해제
  const toggleAll = () => {
    if (selected.length === dummyData.length) {
      setSelected([]);
    } else {
      setSelected(dummyData.map((item) => item.id));
    }
  };

  // ===============================
  // 렌더링 (UI 시작)
  // ===============================
  return (
    <Wrapper>
      {/* 프로필 영역 */}
      <ProfileSection>
        <ProfileImage />
        <ProfileInfo>
          {/* TODO: API에서 프로필 정보(name, email, profileImage) 받아와서 표시해야 함 */}
          <Name>{/* data.name */}닉네임</Name>
          <Email>{/* data.email */}아이디@주소</Email>
        </ProfileInfo>
        <EditLinkButton to='/my/edit'>프로필 수정</EditLinkButton>
      </ProfileSection>

      <br />
      <br />

      {/* 테이블 전체 박스 */}
      <TableWrapper>
        <Title>나의 경사로 데이터</Title>
        {/* 검색창 + 버튼 그룹 */}
        <TopBar>
          <SearchInput placeholder='경사로 정보로 검색하세요...' />
          <SearchIcon>🔍</SearchIcon>

          <ButtonGroup>
            <Button>공유</Button>
            <Button>필터</Button>
            <GreenButton>＋ 데이터 추가</GreenButton>
          </ButtonGroup>
        </TopBar>

        {/* 테이블 헤더 (첫 줄) */}
        <TableHeader>
          {/* TODO: API 총 데이터 길이로 변경 필요 */}
          <CheckBox
            type='checkbox'
            checked={selected.length === dummyData.length}
            onChange={toggleAll}
          />
          <HeaderItem>자치구명</HeaderItem>
          <HeaderItem>시설 유형</HeaderItem>
          <HeaderItem>상호명</HeaderItem>
          <HeaderItem>주소</HeaderItem>
          <HeaderItem>경사로 폭</HeaderItem>
          <HeaderItem>데이터 상태</HeaderItem>
        </TableHeader>

        {[...Array(10)].map((_, i) => (
          <>
            {/* 개별 데이터 행 */}
            <TableRow key={i}>
              {/* TODO: item.id 사용하도록 수정 필요 */}
              <CheckBox
                type='checkbox'
                checked={selected.includes(i + 1)}
                onChange={() => toggleOne(i + 1)}
              />
              {/* TODO: 더미 텍스트 → API 실제 필드로 변경 필요 */}
              <RowItem>자치구명</RowItem>
              <RowItem>시설 유형</RowItem>
              <RowItem>상호명</RowItem>
              <RowItem>주소가 들어갑니다</RowItem>
              <RowItem>경사로 폭</RowItem>
              {/* TODO: API 상태 값으로 변경 필요 */}
              <StatusBadge>승인 완료</StatusBadge>
            </TableRow>
          </>
        ))}

        {/* 페이지네이션 (1,2,3,4 버튼) */}
        <Pagination>
          <PageNum>1</PageNum>
          <PageNum>2</PageNum>
          <PageNum>3</PageNum>
          <PageNum>4</PageNum>
        </Pagination>
      </TableWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 40px;
  background: #f7f7f7;
  min-height: 100vh;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ddd;
`;

const ProfileInfo = styled.div`
  flex-direction: column;
  display: flex;
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const Email = styled.div`
  margin-top: 4px;
  color: #666;
`;

const EditLinkButton = styled(Link)`
  margin-left: auto;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: #efefef;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: inline-block;
`;

const Title = styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
`;

const TableWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 260px;
`;

const SearchIcon = styled.div`
  margin-left: -30px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #efefef;
  cursor: pointer;
`;

const GreenButton = styled(Button)`
  background: #b0e618;
  color: white;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 120px 120px 120px 1fr 100px 120px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  font-size: 14px;
`;

const HeaderItem = styled.div``;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 120px 120px 120px 1fr 100px 120px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
  align-items: center;
`;

const CheckBox = styled.input`
  cursor: pointer;
`;

const RowItem = styled.div``;

const StatusBadge = styled.div`
  padding: 6px 12px;
  background: #b0e61820;
  color: #7db400;
  border-radius: 20px;
  font-size: 12px;
  text-align: center;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageNum = styled.div`
  padding: 6px 10px;
  border-radius: 6px;
  background: #efefef;
  cursor: pointer;
`;
