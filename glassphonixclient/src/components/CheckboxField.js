import React from 'react';

const CheckboxField = (props) => {
  return (
    <div>
      <label>{props.label}
        <br></br>
        <input
          type="checkbox"
          onChange={props.onChange}
          name={props.name}
          value= {props.option}
        />{props.option}<br></br>

      </label>
    </div>
  );
}

export default CheckboxField;
