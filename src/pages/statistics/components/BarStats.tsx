import styled from '@emotion/styled';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '식당', value: 35 },
  { name: '부동산', value: 12 },
  { name: '카페', value: 23 },
  { name: '화장품 판매점', value: 15 },
  { name: '기타', value: 18 },
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
