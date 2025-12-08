import React from 'react';
import { Check } from 'lucide-react';
import * as S from './DataPage.styles';

export type CheckboxProps = {
  checked?: boolean;
  onChange?: () => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <S.CheckboxWrapper checked={checked} onClick={onChange}>
      {checked && <Check size={16} color='#90ce0c' />}
    </S.CheckboxWrapper>
  );
};
