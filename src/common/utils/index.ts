export const parseMongo = <T>(mongoResponse: T): T => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

export const parseQueryParam = (param: string | string[] | undefined) => {
  return !param ? '' : Array.isArray(param) ? param.join(',') : param;
};

export const setBodyBgByStyle = (sortBy: string) => {
  let style = '';

  switch (sortBy) {
    case 'dateAsc':
      style = 'linear-gradient(0deg, #030f1a 0%, #001727 50%, #05182a 100%)';
      break;
    case 'dateDesc':
      style = 'linear-gradient(180deg, #030f1a 0%, #001727 50%, #05182a 100%)';
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
