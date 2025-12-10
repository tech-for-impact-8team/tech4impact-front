import styled from '@emotion/styled';
import { CardStats } from '../components/CardStats';
import { BarStats } from '../components/BarStats';
import { CircleStats } from '../components/CircleStats';
import { LineStats } from '../components/LineStats';
import { SlopeStats } from '../components/SlopeStats';

export const StatisticsPage = () => {
  return (
    <Wrapper>
      <Content>
        {/* Top Cards */}
        <CardRow>
          <CardStats title='Total' value='7,265' percent='+11.01%' positive />
          <CardStats title='Visits' value='3,671' percent='-0.03%' />
          <CardStats title='New Users' value='156' percent='+15.03%' positive />
          <CardStats title='Active Users' value='2,318' percent='+6.08%' positive />
        </CardRow>

        {/* Middle: Line + Slope */}
        <MainGrid>
          <LargeChartBox>
            <ChartHeader>
              <Tab active>Total Data</Tab>
              <Tab>Total Projects</Tab>
              <Tab>Operating Status</Tab>
            </ChartHeader>
            <LineStats />
          </LargeChartBox>

          <SmallChartBox>
            <SidebarTitle>경사로 분포</SidebarTitle>
            <SlopeStats />
          </SmallChartBox>
        </MainGrid>

        {/* Bottom: Bar + Circle */}
        <BottomGrid>
          <ChartBox>
            <BottomTitle>업종별 경사로 수</BottomTitle>
            <BarStats />
          </ChartBox>

          <ChartBox>
            <BottomTitle>지역별 경사로 설치 분포</BottomTitle>
            <CircleStats data={[]}></CircleStats>
          </ChartBox>
        </BottomGrid>
      </Content>
    </Wrapper>
  );
};

/* -----------------------------
   Styled Components
----------------------------- */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const LargeChartBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
`;

const SmallChartBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
`;

const ChartBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
`;

const ChartHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
`;

const Tab = styled.div<{ active?: boolean }>`
  font-size: 14px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: ${(p) => (p.active ? '2px solid #000' : 'none')};
  color: ${(p) => (p.active ? '#000' : '#888')};
`;

const SidebarTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const BottomTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;
