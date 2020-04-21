import React, { Component } from 'react';
import './registerForm.css';
import firebase from '../firebase'


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
        console.log(this.state)
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
                    <form class="" action="#" onSubmit={this.handleSubmit}>

                        <div class="form-group">
                            <label for="name" class="cols-sm-2 control-label">Имя</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
                                    <input type="text" class="form-control" name="name" id="name" placeholder="Введите ваше Имя" required pattern="[A-Za-zА-Яа-я]+" onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="username" class="cols-sm-2 control-label">Фамилия</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
                                    <input type="text" class="form-control" name="username" id="surname" placeholder="Введите вашу фамилию" required pattern="[A-Za-zА-Яа-я]+"  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email" class="cols-sm-2 control-label">Email</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
                                    <input type="email" class="form-control" name="email" id="email" placeholder="Введите ваш Email" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="password" class="cols-sm-2 control-label">Пароль</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" class="form-control" name="password" id="password" placeholder="Введите ваш пароль" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirm" class="cols-sm-2 control-label">Подтверждение пароля</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" class="form-control" name="confirm" id="passwordConfirm" placeholder="Введите ваш пароль" required  onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirm" class="cols-sm-2 control-label">Ключ (необязательно)</label>
                            <div class="cols-sm-10">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="password" class="form-control" name="confirm" id="confirm" placeholder="Введите ключ директора компании" />
                                </div>
                            </div>
                        </div>

                        <div class="form-group ">
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