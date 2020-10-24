export const sortDescendingByNumber = data => {
  return data.sort((a,b) => a.number - b.number);
}

export const sortAscendingByNumber = data => {
  return data.sort((a,b) => a.number - b.number).reverse();
}