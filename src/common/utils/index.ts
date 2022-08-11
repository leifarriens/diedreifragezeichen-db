export const parseMongo = (mongoResponse: unknown) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

export const parseQueryParam = (param: string | string[] | undefined) => {
  return !param ? '' : Array.isArray(param) ? param.join(',') : param;
};
