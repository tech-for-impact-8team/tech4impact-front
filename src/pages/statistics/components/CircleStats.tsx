import styled from '@emotion/styled';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type CircleStatsProps = {
  data: { name: string; value: number; percent?: number }[];
};

const COLORS = ['#000', '#6FA8FF', '#9AD5C0', '#8FB0D9'];

export const CircleStats = ({ data }: CircleStatsProps) => {
  return (
    <Wrapper>
      <ChartArea>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={80} dataKey='value' paddingAngle={3}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartArea>

      <LegendArea>
        {data.map((item, idx) => (
          <LegendItem key={item.name}>
            <ColorDot color={COLORS[idx]} />
            <span>
              {item.name} {item.percent}%
            </span>
          </LegendItem>
        ))}
      </LegendArea>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 220px;
`;

const ChartArea = styled.div`
  width: 60%;
  height: 100%;
`;

const LegendArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
`;

const ColorDot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.color};
`;
