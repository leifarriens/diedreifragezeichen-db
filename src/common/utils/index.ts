import { NextApiRequest } from 'next/types';

export const parseMongo = <T>(mongoResponse: T): T => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

export const parseQueryParam = (param: string | string[] | undefined) => {
  return !param ? '' : Array.isArray(param) ? param.join(',') : param;
};

export const parseAllQueryParams = <T = { [key: string]: string }>(
  query: NextApiRequest['query'],
) => {
  return Object.keys(query).reduce((curr, acc) => {
    const entry = query[acc];
    const value = Array.isArray(entry) ? entry[0] : entry;

    const parsed = isNaN(Number(value)) ? value : Number(value);

    return { ...curr, [acc]: parsed };
  }, {}) as T;
};

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
