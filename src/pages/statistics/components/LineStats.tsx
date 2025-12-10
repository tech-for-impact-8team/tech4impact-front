import styled from '@emotion/styled';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', lastYear: 90, thisYear: 100 },
  { month: 'Feb', lastYear: 120, thisYear: 110 },
  { month: 'Mar', lastYear: 150, thisYear: 160 },
  { month: 'Apr', lastYear: 180, thisYear: 220 },
  { month: 'May', lastYear: 170, thisYear: 230 },
  { month: 'Jun', lastYear: 190, thisYear: 250 },
  { month: 'Jul', lastYear: 210, thisYear: 260 },
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
