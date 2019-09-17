import React, { Component } from "react";
import SpeechRecognition from './SpeechRecognition'

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
    };
  }


render(){


  return (
    <div className ="container">
      <SpeechRecognition/>

  </div>
)
}

}
