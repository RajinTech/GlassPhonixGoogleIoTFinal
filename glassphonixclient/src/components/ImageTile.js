import { Link } from 'react-router';
import React from 'react';

const ImageTile = (props) => {
  return (
    <label>{props.label}
      <input
        type="file"
        onChange={props.onChange}
        name={props.name}
        value={props.content}
      />
    </label>
  )
}

export default ImageTile
