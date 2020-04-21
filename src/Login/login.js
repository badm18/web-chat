import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { BrowserRouter as Link, NavLink, Route, Redirect } from "react-router-dom";
import firebase from '../firebase'
import * as app from "firebase/app";

class Login extends Component {

  constructor() {
    super();

    this.state = {
      email: null,
      password: null,
    }
    this.login = this.login.bind(this);
  }


  login() {
    
    
    firebase.login(this.state.email, this.state.password);
        this.props.history.push('/id');
     
    
    
    



//     if(firebase.isUserSignedIn){
//  }
    
  
  }






  render() {
    return (


      <div className="container">
        <h2>Вход</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Логин:</label>
            <input type="email" className="form-control" id="email" placeholder="Введите ваш email" name="email" required onChange={(event) => this.setState({ email: event.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Пароль:</label>
            <input type="password" className="form-control" id="pwd" placeholder="Введите ваш пароль" name="pswd" required onChange={(event) => this.setState({ password: event.target.value })} />
          </div>
          <div className="form-group form-check">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox" name="remember" /> Запомнить меня
            </label>

            <NavLink to={'/registration'} id='registr'>Регистрация</NavLink>

          </div>
          <button type="submit" className="btn btn-primary" onClick={this.login}>Продолжить</button>
        </form>

      </div>




    );
  }




}
export default Login;