import React from 'react';

const RadioField = (props) => {
  return (
    <div>
      <label>{props.label}
        <br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option1}
        />{props.option1}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option2}
        />{props.option2}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option3}
        />{props.option3}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option4}
        />{props.option4}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option5}
        />{props.option5}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option6}
        />{props.option6}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option7}
        />{props.option7}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option8}
        />{props.option8}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option9}
        />{props.option9}<br></br>
        <input
          type="radio"
          onChange={props.onChange}
          name={props.name}
          value= {props.option10}
        />{props.option10}<br></br>
      </label>
    </div>
  );
}

export default RadioField;
