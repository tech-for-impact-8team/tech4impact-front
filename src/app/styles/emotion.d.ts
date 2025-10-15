import '@emotion/react';

declare module '@emotion/react' {
  import { ColorsType } from '@styles/colors.ts';
  import { FontsType } from '@styles/fonts.ts';

  export interface Theme extends Theme {
    colors: ColorsType;
    fonts: FontsType;
  }
}
