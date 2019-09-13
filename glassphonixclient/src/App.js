import React, { Component } from "react";
import ActionTile from './components/ActionTile'
import Form from './containers/Form'
import Playground from './containers/Playground'

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      actions: [],
      action: {},
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
        this.gatherState = this.gatherState.bind(this)
  }


  componentDidMount() {
    fetch("http://localhost:8080/api/books")
    .then(response => response.json())
    .then( responseJson=> {
      console.log(responseJson);
      this.setState({ actions:responseJson.items });
      console.log(this.state.actions[0]);
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
      editAction: false
    })
  };

  goToPlayground(){
    this.setState({
      form: false,
      playground: true,
      viewActions: false,
      editAction: false
    })
  };

  viewActions(){
    this.setState({
      form: false,
      playground: false,
      viewActions: true,
      editAction: false
    })
  };
  editAction(){
    this.setState({
      form: false,
      playground: false,
      viewActions: false,
      editAction: true
    })
  };
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

    if (this.state.form === true ) {
      return(
        <div className ="container">
          {navBar}
          <Form
          gatherState={this.gatherState}
        />
        </div>
        )
      } else if (this.state.viewActions === true) {
      return (
        <div className ="container">
          {navBar}
          {actions}
      </div>
      )
    } else if (this.state.playground === true) {
    return (
      <div className ="container">
        {navBar}
      <Playground/>
    </div>
    )
  }

  }
}
