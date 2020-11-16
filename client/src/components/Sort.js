import React from 'react';


const Sort = ({ onSortChange }) => {
  return (
    <div>
      <label className="button">
        Neuste zuerst
        <input type="radio" name="sort" value="dateDesc" onChange={e => onSortChange(e.target.value)}/>
      </label>
      <label className="button">
        Älteste zuerst
        <input type="radio" name="sort" value="dateAsc" onChange={e => onSortChange(e.target.value)}/>
      </label>
      <label className="button">
        Beste zuerst
        <input type="radio" name="sort" value="rating" onChange={e => onSortChange(e.target.value)}/>
      </label>
    </div>
  );
}

export default Sort;