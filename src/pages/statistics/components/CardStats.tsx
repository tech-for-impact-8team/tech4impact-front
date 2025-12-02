import styled from '@emotion/styled';

type CardStatsProps = {
  title: string;
  value: string | number;
  percent: string;
  positive?: boolean;
};

export const CardStats = ({ title, value, percent, positive }: CardStatsProps) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
      <Percent positive={positive}>{percent}</Percent>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #e4e8f0;
  padding: 24px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  font-size: 16px;
  color: #666;
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

const Percent = styled.div<{ positive?: boolean }>`
  font-size: 14px;
  color: ${(p) => (p.positive ? '#3CB371' : '#d9534f')};
`;
