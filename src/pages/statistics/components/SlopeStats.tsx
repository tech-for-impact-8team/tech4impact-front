import styled from '@emotion/styled';

const data = [
  { region: '마포구', value: 20 },
  { region: '서초구', value: 40 },
  { region: '성동구', value: 30 },
  { region: '종로구', value: 70 },
  { region: '강동구', value: 50 },
  { region: '용산구', value: 25 },
];

export const SlopeStats = () => {
  return (
    <Wrapper>
      {data.map((item) => (
        <Row key={item.region}>
          <RegionName>{item.region}</RegionName>
          <BarBg>
            <BarFill style={{ width: `${item.value}%` }} />
          </BarBg>
        </Row>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RegionName = styled.div`
  width: 60px;
  font-size: 14px;
`;

const BarBg = styled.div`
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 6px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 6px;
  background: #000;
  border-radius: 6px;
`;
