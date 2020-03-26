import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { BrowserRouter as  Link } from "react-router-dom";


class Login extends Component {



  render() {
    return (


      <div className="container">
        <h2>Вход</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Логин:</label>
            <input type="email" className="form-control" id="email" placeholder="Введите ваш email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Пароль:</label>
            <input type="password" className="form-control" id="pwd" placeholder="Введите ваш пароль" name="pswd" />
          </div>
          <div className="form-group form-check">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox" name="remember" /> Запомнить меня
            </label>

            <Link to="/registration" id="registr">Регистрация</Link>

          </div>
          <button type="submit" className="btn btn-primary" >Продолжить</button>
        </form>
      </div>




    );
  }




}
export default Login;