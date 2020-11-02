import React from 'react';

const Sort = ({ onSortChange }) => {
  return (
    <div>
      <label>
        Neuste zuerst
        <input type="radio" name="sort" value="dateAsc" onChange={e => onSortChange(e.target.value)}/>
      </label>
      <label>
        Älteste zuerst
        <input type="radio" name="sort" value="dateDesc" onChange={e => onSortChange(e.target.value)}/>
      </label>
      <label>
        Beste zuerst
        <input type="radio" name="sort" value="rating" onChange={e => onSortChange(e.target.value)}/>
      </label>
    </div>
  );
}

export default Sort;