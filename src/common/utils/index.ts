export const parseMongo = (mongoResponse: unknown) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};
