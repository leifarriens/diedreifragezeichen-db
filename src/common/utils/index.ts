export const parseMongo = <T>(mongoResponse: T): T => {
  return JSON.parse(JSON.stringify(mongoResponse)) as T;
};

export const parseQueryParam = (param: string | string[] | undefined) => {
  return !param ? '' : Array.isArray(param) ? param.join(',') : param;
};

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
