import React from 'react';
import { useState } from 'react';

const RateInput = (props) => {
  const { name, max, onChange } = props;
  const value = Number(props.value.toFixed(1));

  const [invalue, setInValue] = useState(value);

  return (
    <span className="rating">
      {[...Array(max)].map((e, i) => (
        <label key={i} onMouseOver={() => setInValue(i+1)} onMouseOut={() => setInValue(value)}>
          <input
            type="radio"
            name={name}
            value={i+1}
            checked={value.toFixed(0) == i+1 && true}
            onChange={e => onChange(e.target.value)}
          />
          <RateIcon iterations={i+1}/>
        </label>
      ))}
      {invalue} / {max}
    </span>
  );
}

const RateIcon = ({ iterations }) => {
  return (
    <React.Fragment>
      {[...Array(iterations)].map((u, i) => (
        <span key={i} className="icon"></span>
      ))}
    </React.Fragment>
  );
}

export default RateInput;