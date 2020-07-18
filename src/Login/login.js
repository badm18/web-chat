import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { BrowserRouter as Link, NavLink, } from "react-router-dom";
import firebase from '../firebase'


class Login extends Component {

  constructor() {
    super();

    this.state = {
      email: null,
      password: null,
      error: '',
    }
    this.login = this.login.bind(this);
  }


  async login(e) {
    e.preventDefault();


    await firebase.login(this.state.email, this.state.password).catch(
      (error) => {
        this.setState({
          error: error.message,
        })
      }
    );


    if (!firebase.isUserSignedIn()) {
      return
    }
    return this.props.history.push('/id');
  }














  render() {
    //Вывод сообщений об ошибке
    let errorNotification = this.state.error ?
      (<div className="error">{this.state.error}</div>) : null;


    return (
      <div className="container">
        <h2>Вход</h2>
        {errorNotification}
        <form action=""  >
          <div className="form-group">
            <label htmlFor="email">Логин:</label>
            <input type="email" className="form-control" id="email" placeholder="Введите ваш email" name="email" required onChange={(event) => this.setState({ email: event.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Пароль:</label>
            <input type="password" className="form-control" id="pwd" placeholder="Введите ваш пароль" name="pswd" required onChange={(event) => this.setState({ password: event.target.value })} />
          </div>
          <div className="form-group form-check">
            <NavLink to={'/registration'} id='registr'>Регистрация</NavLink>
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.login} >Продолжить</button>
        </form>

      </div>




    );
  }




}
export default Login;