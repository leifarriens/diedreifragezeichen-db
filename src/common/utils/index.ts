import { colors } from '@/constants/theme';

export const parseMongo = <T>(mongoResponse: T): T => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

export const parseQueryParam = (param: string | string[] | undefined) => {
  return !param ? '' : Array.isArray(param) ? param.join(',') : param;
};

export const setBodyBgByStyle = (sortBy: string) => {
  let style = '';

  const gradient = `${colors.blueShades[0]} 0%, ${colors.blueShades[1]} 50%, ${colors.blueShades[2]} 100%`;

  switch (sortBy) {
    case 'dateAsc':
      style = `linear-gradient(0deg, ${gradient})`;
      break;
    case 'dateDesc':
      style = `linear-gradient(180deg, ${gradient})`;
      break;
    default:
      style = '';
  }

  const container = document.getElementsByClassName(
    'container',
  )[0] as HTMLElement;

  container.style.background = style;
};

export const unsetBodyBgStyle = () => {
  const container = document.getElementsByClassName(
    'container',
  )[0] as HTMLElement;

  container.style.removeProperty('background');
};
