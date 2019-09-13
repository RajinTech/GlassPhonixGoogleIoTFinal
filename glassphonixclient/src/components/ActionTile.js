
import React from 'react';

const ActionTile = (props) => {

  const divStyle = {
    'borderStyle': 'solid',
    'borderColor': 'red',
  };

  return (
    <div style={divStyle} >


      <img src={props.imageUrl} alt="action"></img>

    <p>command {props.title}</p>
      <p>createdBy {props.createdBy}</p>
    <p>description {props.description}</p>
  <p>insidePropane {props.insidePropane}</p>
<p>insideOxygen {props.insideOxygen}</p>
      <p>outsidePropane {props.outsidePropane}</p>
    <p>outsideOxygen {props.outsideOxygen}</p>
<button onClick={props.editAction}>editAction</button>
    </div>




  )
}


export default ActionTile
