import RangeField from '../components/RangeField';



import React, { Component } from 'react';


class PlaygroundForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      ready: "1",
      listening: "No",
      command: "",
      count:0,

    }
    this.handleReadyChange = this.handleReadyChange.bind(this);
    this.printState = this.printState.bind(this)
    this.printReady = this.printReady.bind(this)
    this.sendCommand = this.sendCommand.bind(this)
  }
  componentDidMount(){
    console.log("playgroundForm Mounted");
  }
  handleReadyChange(event) {
    this.setState({ [event.target.name]: event.target.value, });
    if(this.state.listening === "No"){
      this.props.startListening();
      this.setState({ listening: "Yes"});
      console.log(this.props.listening)


    } else if(this.state.listening === "Yes"){
      this.props.stopListening();
      this.setState({ listening: "No"});
      console.log(this.props.listening)
    }
  }


  componentDidUpdate(prevProps) {
    this.state.count ++
    console.log("comDidUpdate", this.state.count)
    console.log("comDidUpdate prev intTran", prevProps.interimTranscript)
    console.log("comDidUpdate curr intTran", this.props.interimTranscript)
    console.log("comDidUpdate prev finTran", prevProps.finalTranscript)
    console.log("comDidUpdate curr finTran", this.props.finalTranscript)
    if(prevProps.interimTranscript && this.props.finalTranscript){
      this.sendCommand()
    }
    if(this.props.finalTranscript){
      this.props.resetTranscript();
    }


  }
  printState(){
    console.log(this.state)
  }
  printReady(state) {
    if (state === "1"){
      return("No")
    } else if (state === "2"){
      return ("Yes")
    }
  }
  moreOxygen(){
    let command = this.state.command;
    console.log("More Oxy command", command)
    command.insideOxygen = parseInt(command.insideOxygen * 1.1).toString()
    command.outsideOxygen = parseInt(command.outsideOxygen * 1.1).toString()
    if( parseInt(command.insideOxygen) >= parseInt("99")) {
      command.insideOxygen = "99"
    };
    if( parseInt(command.outsideOxygen) >= parseInt("99")) {
      command.outsideOxygen = "99"
    };
    console.log("More Oxy command af", command)
    this.state.command = command;
  }
  lessOxygen(){
    let command = this.state.command;
    console.log("Less Oxy command b4", command)
    command.insideOxygen = parseInt(command.insideOxygen * 0.9).toString()
    command.outsideOxygen = parseInt(command.outsideOxygen * 0.9).toString()
    console.log("Less Oxy command af", command)

    this.state.command = command;
  }


  sendCommand(){
    let actions_demo = [
      {
      title: "Kamehameha",
      device: "Charizard",
      description: "For Krillan",
      insidePropane: "59",
      insideOxygen: "99",
      outsidePropane: "46",
      outsideOxygen: "99",
      imageUrl: "",
      ready: "1",
      realtime: "2",
      listening: "No",
    },
    {
    title: "banana",
    device: "Charizard",
    description: "For Krillan",
    insidePropane: "59",
    insideOxygen: "99",
    outsidePropane: "46",
    outsideOxygen: "99",
    imageUrl: "",
    ready: "1",
    realtime: "2",
    listening: "No",
    },
    {
    title: "inside fire",
    device: "Charizard",
    description: "For Krillan",
    insidePropane: "59",
    insideOxygen: "99",
    outsidePropane: "0",
    outsideOxygen: "0",
    imageUrl: "",
    ready: "1",
    realtime: "2",
    listening: "No",
    },
    {
      title: "turn off",
      device: "Charizard",
      description: "For Krillan",
      insidePropane: "0",
      insideOxygen: "0",
      outsidePropane: "0",
      outsideOxygen: "0",
      imageUrl: "",
      ready: "1",
      realtime: "2",
      listening: "No",
    },];
    if(this.props.finalTranscript === "more oxygen"){
      this.moreOxygen()
      console.log(this.state.command)
    } else if(this.props.finalTranscript === "less oxygen"){
      this.lessOxygen()
      console.log(this.state.command)
    } else {
    this.state.command = actions_demo.find(x => x.title === this.props.finalTranscript)
    }
    let formPayload = this.state.command;
    console.log("send command", formPayload);
    fetch('api/books', {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(formPayload),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
          return response;
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));


  }

  render(){


    return(
      <div>
        <button onClick={this.printState}>State</button>
      <div><h1>Add a New Action</h1></div>


  <div>Interim:{this.props.interimTranscript}</div>

          <h5>Command:</h5>
            <RangeField
              label="Ready"
              name="ready"
              onChange={this.handleReadyChange}
              value={this.state.ready}
              max="2"
            />



  </div>
)}}

export default PlaygroundForm
