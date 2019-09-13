import React from 'react';

const DateField = (props) => {
  return (
    <div>
      <label>{props.label}
        <br></br>
        <input
          type="date"
          min="2019-01-01"
          max="2099-12-31"

          onChange={props.onChange}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
        />
      </label>
    </div>
  );
}

export default DateField;
