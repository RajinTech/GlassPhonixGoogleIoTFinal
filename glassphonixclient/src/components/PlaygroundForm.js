import RangeField from '../components/RangeField';
import RadioField from '../components/RadioField'
import CheckboxField from '../components/CheckboxField'
import TextTile from '../components/TextTile';

import React, { Component } from 'react';


class PlaygroundForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: "",
      actions:[],
      imageUrl: "",
      ready: "1",
      listening: "No",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.printState = this.printState.bind(this)
    this.printReady = this.printReady.bind(this)
    this.toggleListen = this.toggleListen.bind(this)
    this.updateTitle = this.updateTitle.bind(this)


  }

  componentDidMount() {
    this.setState({ actions: this.props.actions });
  };

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

            <CheckboxField
              label="Device"
              name="device"
              option="Charizard"
              onChange={this.handleChange}
              value={this.state.device}
            />

            <CheckboxField
              label="Device"
              name="device"
              option="Gloria"
              onChange={this.handleChange}
              value={this.state.device}
            />

            <button onClick={this.toggleListen}>Start Listening</button>
            <button onClick={this.toggleListen}>Stop Listening</button>
            <button onClick={this.updateTitle}>Submit Command</button>
            <button onClick={this.props.resetTranscript}>Reset</button>
            <span>Listening: {this.state.listening} </span>
            <span>{this.props.interimTranscript}</span>
            <span>{this.props.finalTranscript}</span>
            
            <TextTile
              label="Command"
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              content={this.state.title}
              placeholder={this.state.title}
            />



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


        <input className="button" type="submit" value="Submit"/>
    </fieldset>
      </form>
  </div>
)}}

export default PlaygroundForm
