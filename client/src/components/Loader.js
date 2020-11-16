import React from 'react';

export const FullpageLoader = () => {
  const style = {
    zIndex: '999',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center'
  }
  
  return (
    <div style={style}>
      <Loader/>
    </div>
  );
}

export const Loader = () => {
  return (
    <div className="loader">
      <div className="rect1">?</div>
      <div className="rect2">?</div>
      <div className="rect3">?</div>
    </div>
  );
}

export default Loader;