import React, { Component } from "react";
import ActionTile from '../components/ActionTile'
import Form from './/Form'
import Playground from './/Playground'


export default class Glassphonix extends Component {
  constructor(props) {
    super();
    this.state = {
      actions: [],
      action: {},
      currentAction: "",
      playground: false,
      form: false,
      viewActions: true,
      editAction: false
    };
        this.imageCheck = this.imageCheck.bind(this)
        this.createAction = this.createAction.bind(this)
        this.goToPlayground = this.goToPlayground.bind(this)
        this.viewActions = this.viewActions.bind(this)
        this.editAction = this.editAction.bind(this)
        this.deleteAction = this.deleteAction.bind(this)
        this.deleteAllAction = this.deleteAllAction.bind(this)
        this.gatherState = this.gatherState.bind(this)
  }


  componentDidMount() {
    fetch("http://localhost:8080/api/books")
    .then(response => response.json())
    .then( responseJson=> {
      console.log(responseJson);
      this.setState({ actions:responseJson.items });
      console.log(this.state.actions);
  
      this.state.actions.forEach((action) => {
        if (action.title === "Kamehameha"){
          console.log(action);
        }
      })
    },
  )}

  imageCheck(imageUrl){
    if (imageUrl === ""){
      return (
        "http://images.clipartpanda.com/realistic-fire-flames-clipart-18579640-fire-flame.jpg"
      )
    }
  };

  createAction(){
    this.setState({
      form: true,
      playground: false,
      viewActions: false,
      editAction: false,
    })
  };

  goToPlayground(){
    this.setState({
      form: false,
      playground: true,
      viewActions: false,
      editAction: false,
    })
  };

  viewActions(){
    this.setState({
      form: false,
      playground: false,
      viewActions: true,
      editAction: false,
    })
  };








  deleteAction(book){
    console.log(JSON.stringify(book));
    let formPayload = book;
    fetch(`http://localhost:8080/api/books`, {
      credentials: 'same-origin',
      method: 'DELETE',
      body: JSON.stringify(formPayload),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          console.log(response);
        } else {
          let errorMessage = `${response.status} (${response.statusText})`,
              error = new Error(errorMessage);
          throw(error);
        }
      })
    //  .then(response => response.json())
      //.then(body => {
        //browserRouter.push(`/books`);
      //})
      .catch(error => console.error(`Error in fetch: ${error.message}`));
  };



  deleteAllAction(){
    this.state.actions.forEach((action) => {
    let id = action.id;
    let formPayload = id;
    fetch(`http://localhost:8080/api/books/${id}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      body: formPayload,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {

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
    });
  };


  editAction() {
  console.log(`editAction`)
}


  gatherState(formPayload){
    this.setState(prevState => ({
  actions: [...prevState.actions, formPayload]
}))
    console.log(`gatherState state: ${this.state.actions}`)
    console.log(`gatherState state singular: ${this.state.actions[0].id}`)
  }


  render(){


    let actions = this.state.actions.map(action => (
      <ActionTile
        key={action.id}
        id={action.id}
        title={action.title}
        command={action.command}
        createdBy={action.createdBy}
        description={action.description}
        insidePropane={action.insidePropane}
        insideOxygen={action.insideOxygen}
        outsidePropane={action.outsidePropane}
        outsideOxygen={action.outsideOxygen}
        leftDoorPosition={action.leftDoorPosition}
        rightDoorPosition={action.rightDoorPosition}
        imageUrl={this.imageCheck(action.imageUrl)}
        editAction={this.editAction}
        deleteAction={this.deleteAction}
    />
    ));


    let navBar =
    <div>
      <h1>GlassPhonix</h1>
      <div>
        <button onClick={this.createAction} >Create Action</button>
        <button onClick={this.goToPlayground}>Playground</button>
        <button onClick={this.viewActions}>View Actions</button>
      </div>
    </div>
    //  RENDER FORM
    if (this.state.form === true ) {
      return(
        <div className ="container">
          {navBar}
          <Form
          transcript={this.props.transcript}
          resetTranscript={this.props.resetTranscript}
          startListening={this.props.startListening}
          stopListening={this.props.stopListening}
          interimTranscript={this.props.interimTranscript}
          finalTranscript={this.props.finalTranscript}
          listening={this.props.listening}
          />
        </div>
        )
        //  RENDER ACTIONS
      } else if (this.state.viewActions === true) {
      return (
        <div className ="container">
          {navBar}
          <button onClick={this.deleteAllAction}>Delete All</button>
          {actions}
      </div>
      )
      //  RENDER PLAYGROUND

    } else if (this.state.playground === true) {
    return (
      <div className ="container">
        {navBar}
      <Playground
      actions={this.state.actions}
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
}
