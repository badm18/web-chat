import React, { Component } from 'react';
import * as firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login/login';
import RegistrForm from './RegisterForm/registerForm';
import MainPage from './MainPage/mainPage'
import { BrowserRouter as Router, Route} from "react-router-dom";


class App extends Component {
  constructor() {
    super();
    this.state = {
      speed: 10
    }
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('speed');
    rootRef.on('value', snap => {
      this.setState({
        speed: snap.val()
      });
    });
  }







  render() {
    return (
      //   <div className="App">
      // <h1>{this.state.speed}</h1>
      //   </div>


      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/registration" component={RegistrForm} />
        <Route path="/id" component={MainPage} />



      </Router>








    );
  }
}

export default App;
