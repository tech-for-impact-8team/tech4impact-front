import styled from '@emotion/styled';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Linux', value: 15000 },
  { name: 'Mac', value: 27000 },
  { name: 'iOS', value: 23000 },
  { name: 'Windows', value: 30000 },
  { name: 'Android', value: 12000 },
  { name: 'Other', value: 25000 },
];

export const BarStats = () => {
  return (
    <Wrapper>
      <ResponsiveContainer width='100%' height={260}>
        <BarChart data={data}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='value' fill='#82DDF0' radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
