import React, { useEffect, useState } from 'react';

const Search = (props) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.onQuery(query);
  }, [query]);

  const inputStyle = {
    padding: '12px 18px',
    borderRadius: '25px',
    border: 'none',
    width: '250px'
  }

  const style = {
    // position: 'sticky',
    top: '84px',
    zIndex: '2'
  }

  return (
    <div style={style}>
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