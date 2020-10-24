import React, { useEffect, useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    console.log(e.target.value);
  }

  // useEffect(() => {
  //   const results = 
  // });

  return (
    <div>
      <input
        type="text"
        placeholder="Suchen..."
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Search;