import RangeField from '../components/RangeField';
import RadioField from '../components/RadioField'
import TextTile from '../components/TextTile';

import React, { Component } from 'react';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      device: "",
      description: "",
      insidePropane: "",
      insideOxygen: "",
      outsidePropane: "",
      outsideOxygen: "",
      imageUrl: "",
      ready: "1",
      realtime: "1",
      listening: "No",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.printState = this.printState.bind(this)
    this.printReady = this.printReady.bind(this)
    this.toggleListen = this.toggleListen.bind(this)
    this.updateTitle = this.updateTitle.bind(this)


  }

  handleChange(event) {
    console.log(`eventname: ${event.target.name}`)
    console.log(`eventvalue: ${event.target.value}`)
    console.log(this.state.date)
  this.setState({
    [event.target.name]: event.target.value,
    date: Date()
    })
    let formPayload = this.state;
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
        if (response.ok) {
          //this.props.gatherState(formPayload)
          return response;
        } else {
          let errorMessage = `${response.status} (${response.statusText})`,
              error = new Error(errorMessage);
          throw(error);
        }
      })
      .then(response => response.json())
      .then(body => {
        //browserRouter.push(`/books`);
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
  }


   updateTitle(finalTranscript){
     this.setState({
       title: this.props.finalTranscript
     });
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

  toggleListen(){
    if (this.state.listening === "No"){
      console.log(`toggleListen`)
      this.props.startListening();
      this.setState({ listening: "Yes"})
    } else if (this.state.listening === "Yes"){
      this.props.stopListening();
      this.setState({
        listening: "No"
      });

      console.log(`after submit ${this.state.title}`)
    }
  }

  handleSubmit(event){
    event.preventDefault();
    let formPayload = this.state;
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
        if (response.ok) {
          //this.props.gatherState(formPayload)
          return response;
        } else {
          let errorMessage = `${response.status} (${response.statusText})`,
              error = new Error(errorMessage);
          throw(error);
        }
      })
      .then(response => response.json())
      .then(body => {
        //browserRouter.push(`/books`);
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
  }


  render(){



    return(
      <div>
        <button onClick={this.printState}>State</button>
      <div><h1>Add a New Action</h1></div>
      <form onSubmit={this.handleSubmit} className="">
        <fieldset><legend>Device</legend>

            <RadioField
              label="Device"
              name="device"
              option1="Charizard"
              option2="Brian"
              option3="Alfred"
              option4="Preston"
              option5="Milhouse"
              option6="Hans"
              option7="Taylor"
              option8="Gloria"
              option9="Flo"
              option10="Morty"
              onChange={this.handleChange}
              value={this.state.device}
            />
            <div>
              <h5 className="slider-name" >See Changes in Real Time? {this.printReady(this.state.realtime)} </h5>
          </div>
            <RangeField
              label="RealTime"
              name="realtime"
              onChange={this.handleChange}
              value={this.state.realtime}
              max="2"
            />
          <div>
            <button onClick={this.toggleListen}>Start Listening</button>
            <button onClick={this.toggleListen}>Stop Listening</button>
            <button onClick={this.updateTitle}>Submit Command</button>
            <button onClick={this.props.resetTranscript}>Reset</button>
            <span>Listening: {this.state.listening} </span>
            <span>{this.props.interimTranscript}</span>
            <span>{this.props.finalTranscript}</span>
          </div>

            <TextTile
              label="Command"
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              content={this.state.title}
              placeholder={this.state.title}
            />


            <RangeField
              label="Inside Propane"
              name="insidePropane"
              onChange={this.handleChange}
              value={this.state.insidePropane}
              max="255"
            />
            <div>
              <h5 className="slider-name" >{this.state.insidePropane} insidePropane</h5>
            </div>
            <RangeField
              label="Inside Oxygen"
              name="insideOxygen"
              onChange={this.handleChange}
              value={this.state.insideOxygen}
              max="99"
            />
            <div>
              <h5 className="slider-name" >{this.state.insideOxygen} insideOxygen</h5>
            </div>
            <RangeField
              label="Outside Propane"
              name="outsidePropane"
              onChange={this.handleChange}
              value={this.state.outsidePropane}
              max="99"
            />
            <div>
              <h5 className="slider-name" >{this.state.outsidePropane} outsidePropane</h5>
            </div>
            <RangeField
              label="Outside Oxygen"
              name="outsideOxygen"
              onChange={this.handleChange}
              value={this.state.outsideOxygen}
              max="99"
            />
            <div>
              <h5 className="slider-name" >{this.state.outsideOxygen} outsideOxygen</h5>
            </div>

            <div>
              <h5 className="slider-name" >Ready? {this.printReady(this.state.ready)} </h5>
          </div>
            <RangeField
              label="Ready"
              name="ready"
              onChange={this.handleChange}
              value={this.state.ready}
              max="2"
            />


        <input className="button" type="submit" value="Submit New Listing"/>
    </fieldset>
      </form>
  </div>
)}}

export default Form
