export default (state, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      }
    case 'SET_JWT':
      return {
        ...state,
        token: action.payload
      }
    default:
      return state;
  }
}