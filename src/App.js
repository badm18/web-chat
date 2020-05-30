import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login/login';
import RegistrForm from './RegisterForm/registerForm';
import MainPage from './MainPage/mainPage'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import * as app from "firebase/app";





class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }








  render() {
    return (
        <Router>
        <Route exact path="/" component={Login} />
        <Route path="/registration" component={RegistrForm} />
        <Route path="/id"> 
        {this.state.user ? <MainPage />: <Redirect push to={'/'} />}
        </Route>
        </Router>
    );
  }
}

export default App;
