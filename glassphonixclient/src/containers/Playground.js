import React, { Component } from "react";
import PlaygroundForm from '../components/PlaygroundForm';

export default class Playground extends Component {
  constructor(props) {
    super();
    this.state = {
    };
  }
  render(){
      return(
        <div>
        <h1>Playground</h1>
        <PlaygroundForm
          actions={this.props.actions}
          transcript={this.props.transcript}
          resetTranscript={this.props.resetTranscript}
          startListening={this.props.startListening}
          stopListening={this.props.stopListening}
          interimTranscript={this.props.interimTranscript}
          finalTranscript={this.props.finalTranscript}
          listening={this.props.listening}/>

        </div>
        )
  }
}
