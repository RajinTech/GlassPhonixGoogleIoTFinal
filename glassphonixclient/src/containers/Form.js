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
      ready:"",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.printState = this.printState.bind(this)
    this.printReady = this.printReady.bind(this)


  }

  handleChange(event) {
    console.log(`eventname: ${event.target.name}`)
    console.log(`eventvalue: ${event.target.value}`)
  this.setState({
    [event.target.name]: event.target.value
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
          this.props.gatherState(formPayload)
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
          this.props.gatherState(formPayload)
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


            <TextTile
              label="Command"
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
            />


            <RangeField
              label="Inside Propane"
              name="insidePropane"
              onChange={this.handleChange}
              value={this.state.insidePropane}
              max="99"
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
            <RangeField
              label="Ready"
              name="ready"
              onChange={this.handleChange}
              value={this.state.ready}
              max="2"
            />
            <div>
              <h5 className="slider-name" >Ready? {this.printReady(this.state.ready)} </h5>
            </div>


        <input className="button" type="submit" value="Submit New Listing"/>
    </fieldset>
      </form>
  </div>
)}}

export default Form
