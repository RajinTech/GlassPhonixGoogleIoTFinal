import React from 'react';

const RangeField = (props) => {
  return (
    <div>
      <label>{props.label}
        <br></br>
        <input
          type="range"
          min="1"
          max={props.max}
          onChange={props.onChange}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
        />
      </label>
    </div>
  );
}

export default RangeField;
