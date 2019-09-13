import React from 'react';

const TextTile = (props) => {
  return (
      <label>{props.label}
        <input
          className="input-slant"
          type="text"
          onChange={props.onChange}
          name={props.name}
          value={props.content}
          placeholder={props.placeholder}
        />
      </label>
    );
}

export default TextTile;
