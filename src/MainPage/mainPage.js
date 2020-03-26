import React, { Component } from 'react';
import './mainPage.css';


class MainPage extends Component {
    constructor() {
        super();

        this.state = {
            date: new Date(),
            task:[1,4,3,5],
        }



        this.time = this.time.bind(this);
        this.addZero = this.addZero.bind(this);
        this.addTask=this.addTask.bind(this);
    }


    componentDidMount() {
        this.timerID = setInterval(
            () => this.time()
            , 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    //часы на главной странице
    time() {
        this.setState({
            date: new Date()
        })
    }


    //добавляет 0 в дни и месяцы
    addZero(num) {
        if (num <= 9) return '0' + num;
        else return num;
    }


   




    render() {


        return (

            <div className="main-container">


                <div className="left-side">
                    <nav className="icons-nav">
                   <a href="" id="calendar-ref"> <svg  id="calendar-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 5 0 L 5 4 L 7 4 L 7 0 Z M 17 0 L 17 4 L 19 4 L 19 0 Z M 1 3 C 0.449219 3 0 3.449219 0 4 L 0 7 C 0 7.550781 0.449219 8 1 8 L 1 24 L 23 24 L 23 8 C 23.550781 8 24 7.550781 24 7 L 24 4 C 24 3.449219 23.550781 3 23 3 L 20 3 L 20 5 L 16 5 L 16 3 L 8 3 L 8 5 L 4 5 L 4 3 Z M 3 8 L 21 8 L 21 22 L 3 22 Z M 5 10 L 5 12 L 7 12 L 7 10 Z M 9 10 L 9 12 L 11 12 L 11 10 Z M 13 10 L 13 12 L 15 12 L 15 10 Z M 17 10 L 17 12 L 19 12 L 19 10 Z M 5 14 L 5 16 L 7 16 L 7 14 Z M 9 14 L 9 16 L 11 16 L 11 14 Z M 13 14 L 13 16 L 15 16 L 15 14 Z M 17 14 L 17 16 L 19 16 L 19 14 Z M 5 18 L 5 20 L 7 20 L 7 18 Z M 9 18 L 9 20 L 11 20 L 11 18 Z M 13 18 L 13 20 L 15 20 L 15 18 Z M 17 18 L 17 20 L 19 20 L 19 18 Z"/></svg>
                   </a>
                   <a  id="plus-ref" onClick={this.addTask}><svg  id="plus-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path fill-rule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"/></svg></a>
                    </nav>

                    


                </div>


                <div className="center">
                    <header className="search-string">
                        <input id="search" placeholder="Что нужно найти?"></input>
                    </header>
                </div>



                <aside className="right-side">
                    <p id="timer">{this.state.date.toLocaleTimeString()}</p>
                    <p>{this.addZero(this.state.date.getDate())}.{this.addZero(this.state.date.getMonth()+1)}.{this.state.date.getFullYear()}</p>
                </aside>













            </div>








        )
    }






}

export default MainPage