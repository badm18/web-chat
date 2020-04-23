import React, { Component } from 'react';
import './registerForm.css';
import firebase from '../firebase';


class RegisterForm extends Component {


    constructor() {
        super();

        this.state = {
            email: '',
            name: '',
            password: '',
            passwordConfirm: '',
            surname: '',
        }
        this.onRegister = this.onRegister.bind(this);
    }



    handleChange=(e)=>{
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        firebase.register();
    }
   

    onRegister() {
        firebase.register(this.state.name, this.state.surname, this.state.email, this.state.password);
        this.setState({
            email: '',
            name: '',
            password: '',
            passwordConfirm: '',
            surname: '',
        });


    }



    render() {
        return (

            <div class="container">
                <div class="row main-form">
                    <form  onSubmit={this.onRegister}>

                        <div class="form-group">
                            <label for="name" classNameName="cols-sm-2 control-label">Имя</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="name" id="name" placeholder="Введите ваше Имя" required pattern="[A-Za-zА-Яа-я]+" onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>


                        <div className="form-group">
                            <label for="username" className="cols-sm-2 control-label">Фамилия</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-users fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="username" id="surname" placeholder="Введите вашу фамилию" required pattern="[A-Za-zА-Яа-я]+"  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label for="email" className="cols-sm-2 control-label">Email</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-envelope fa" aria-hidden="true"></i></span>
                                    <input type="email" className="form-control" name="email" id="email" placeholder="Введите ваш Email" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>


                        <div className="form-group">
                            <label for="password" className="cols-sm-2 control-label">Пароль</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" className="form-control" name="password" id="password" placeholder="Введите ваш пароль" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label for="confirm" className="cols-sm-2 control-label">Подтверждение пароля</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" className="form-control" name="confirm" id="passwordConfirm" placeholder="Введите ваш пароль" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label for="confirm" className="cols-sm-2 control-label">Ключ (необязательно)</label>
                            <div className="cols-sm-10">
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" className="form-control" name="confirm" id="confirm" placeholder="Введите ключ директора компании" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group ">
                            <button type="submit" id="button" >Зарегестрироваться</button>
                            {/* onClick={this.onRegister} */}
                        </div>

                    </form>
                </div>
            </div>





        );
    }




}

export default RegisterForm;