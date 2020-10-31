import React, { useEffect, useState } from 'react';

const Search = (props) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.onQuery(query);
  }, [query]);

  const style = {
    // textAlign: 'center',
    padding: '0 36px',
    margin: '24px 0'
    // zIndex: '10',
    // position: 'fixed',
    // top: '20px',
    // right: '20px'
  }

  const inputStyle = {
    padding: '12px 18px',
    borderRadius: '25px',
    border: 'none',
    width: '250px'
  }

  return (
    <div>
      <input
        style={inputStyle}
        type="text"
        placeholder="Suchen..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  );
}

export default Search;