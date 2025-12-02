import styled from '@emotion/styled';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', lastYear: 900, thisYear: 1000 },
  { month: 'Feb', lastYear: 1200, thisYear: 950 },
  { month: 'Mar', lastYear: 1500, thisYear: 1600 },
  { month: 'Apr', lastYear: 1800, thisYear: 2200 },
  { month: 'May', lastYear: 1700, thisYear: 2500 },
  { month: 'Jun', lastYear: 1900, thisYear: 2300 },
  { month: 'Jul', lastYear: 2100, thisYear: 2600 },
];

export const LineStats = () => {
  return (
    <Wrapper>
      <Legend>
        <Dot color='#000' />
        This year
        <Dot color='#8ABBD9' />
        Last year
      </Legend>

      <ResponsiveContainer width='100%' height={260}>
        <LineChart data={data}>
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='lastYear'
            stroke='#8ABBD9'
            strokeDasharray='5 5'
            dot={false}
          />
          <Line type='monotone' dataKey='thisYear' stroke='#000' strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const Dot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.color};
  display: inline-block;
`;
