import React, { Component} from 'react'
import './mainPage.css';
import ModalPlus from '../ModalPlus/modalPlus';
import EditTask from '../EditTask/editTask';
import { BrowserRouter as Link, NavLink, Route, Redirect } from "react-router-dom";
import firebase from '../firebase'




class MainPage extends Component {
    constructor(props) {
        super();

        this.state = {
            date: new Date(),
            task: [],
            text: 'Hello world',
            test: '',
            email:null,
        }



        this.time = this.time.bind(this);
        this.addZero = this.addZero.bind(this);
        this.logout= this.logout.bind(this);
        
    }


    componentDidMount() {
        this.timerID = setInterval(
            () => this.time()
            , 1000);

            //  firebase.database().ref().child('speed').on('value',snap=>{
            //      this.setState({
            //          test:snap.val()
            //      })
            //  })
           
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



    updateData = (value) => {
        this.state.task.push(value);
    }

   
logout(e){
    
    try {
        firebase.logout();
     } catch (error) {
       alert(error.message)
 
     }

  
   
    this.props.history.push('/');

}
    



    render() {


        return (

            <div className="main-container">

                
                <div className="left-side">
                    <nav className="icons-nav">
                        <a href="" id="calendar-ref"> <svg id="calendar-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 5 0 L 5 4 L 7 4 L 7 0 Z M 17 0 L 17 4 L 19 4 L 19 0 Z M 1 3 C 0.449219 3 0 3.449219 0 4 L 0 7 C 0 7.550781 0.449219 8 1 8 L 1 24 L 23 24 L 23 8 C 23.550781 8 24 7.550781 24 7 L 24 4 C 24 3.449219 23.550781 3 23 3 L 20 3 L 20 5 L 16 5 L 16 3 L 8 3 L 8 5 L 4 5 L 4 3 Z M 3 8 L 21 8 L 21 22 L 3 22 Z M 5 10 L 5 12 L 7 12 L 7 10 Z M 9 10 L 9 12 L 11 12 L 11 10 Z M 13 10 L 13 12 L 15 12 L 15 10 Z M 17 10 L 17 12 L 19 12 L 19 10 Z M 5 14 L 5 16 L 7 16 L 7 14 Z M 9 14 L 9 16 L 11 16 L 11 14 Z M 13 14 L 13 16 L 15 16 L 15 14 Z M 17 14 L 17 16 L 19 16 L 19 14 Z M 5 18 L 5 20 L 7 20 L 7 18 Z M 9 18 L 9 20 L 11 20 L 11 18 Z M 13 18 L 13 20 L 15 20 L 15 18 Z M 17 18 L 17 20 L 19 20 L 19 18 Z" /></svg>
                        </a>
                        <a id="plus-ref"><ModalPlus id='plus-icon' updateData={this.updateData} /></a>
                    </nav>

                    <div id='tasks'>

                        {this.state.task.map(i =>
                                                    

                            <div className='task'>
                               
                                <header id='taskHeader'>
                                    <p id='taskLabel'>{i.label}</p>
                                </header>


                                <main id='taskMain'>
                                    <p id='taskText'>{i.text}</p>
                                </main>


                                <footer id='taskFooter'>
                                    <p id='dateOfCreation'>{i.dateOfCreation.toLocaleDateString()}</p>
                                    <div className='taskIcons'>
                                        <a id='editLink' ><EditTask taskState={i}  /></a>
                                        <a id='checkMarkLink'><svg id='checkMark' fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z" /></svg></a>
                                    </div>
                                </footer>

                            </div>

                        )}


                    </div>



                </div>


                <div className="center">
                    <header className="search-string">
                        <input id="search" placeholder="Что нужно найти?"></input>
                    </header>
                </div>



                <aside className="right-side">
                    <p id="timer">{this.state.date.toLocaleTimeString()}</p>
                    <p>{this.addZero(this.state.date.getDate())}.{this.addZero(this.state.date.getMonth() + 1)}.{this.state.date.getFullYear()}</p>
                    <p>{firebase.getCurrentUsername()}</p>
                </aside>
                            <button onClick={this.logout}>Выход</button>
            </div>








        )
    }






}

export default MainPage