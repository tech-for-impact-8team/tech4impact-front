const createFontStyle = (
  family: string,
  weight: number,
  size: number,
  lineHeight: number,
  letterSpacing: number,
) => `
  font-family: "${family}", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-weight: ${weight};
  font-variation-settings: 'wght' ${weight};
  font-size: ${size}px;
  line-height: ${lineHeight}%;
  letter-spacing: ${letterSpacing}%;
`;

export const fonts = {};

export type FontsType = typeof fonts;
