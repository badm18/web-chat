import React, { Component } from 'react'
import './mainPage.css';
import ModalPlus from '../ModalPlus/modalPlus';
import EditTask from '../EditTask/editTask';
import * as app from "firebase/app";
import firebase from '../firebase'
import { Redirect } from 'react-router';
import DiologWindow from '../diologWindow/diologWindow';




class MainPage extends Component {
    constructor(props) {
        super();

        this.state = {
            date: new Date(),
            diologs: [],
            task: [],
            text: 'Hello world',
            test: '',
            email: null,
            searchBar: '',
            searchResult: [],
            isDiologOpen: false,
            userInfo: {},
            online: [],
        }



        this.time = this.time.bind(this);
        this.addZero = this.addZero.bind(this);
        this.logout = this.logout.bind(this);
        this.searchBar = this.searchBar.bind(this);
        this.writeMessage = this.writeMessage.bind(this);
        this.onlineStatus = this.onlineStatus.bind(this);
    }


    componentDidMount() {
        let userId = app.auth().currentUser.uid;
        this.timerID = setInterval(
            () => this.time()
            , 1000);

        //Загрузка списка задач для пользователя
        app.database().ref('tasks/' + userId).once('value').then((snapshot) => {
            snapshot.forEach((element) => {
                this.state.task.push(element.val());
            });
        });

        //загрузка диологов пользователя
        app.database().ref('diologs/' + userId).on('child_added', (snapshot) => {
            this.state.diologs.push(snapshot.val())
        })
        //Загрузка последнего сообщения которое было отправлено
        app.database().ref('diologs/' + userId).on('child_changed', (snapshot) => {
           this.state.diologs[this.state.diologs.findIndex(item=>item.id===snapshot.val().id)]=snapshot.val()
        })







        //статус онлайна пользователя
        var myConnectionsRef = app.database().ref('/users/' + userId + '/connections');

        // stores the timestamp of my last disconnect (the last time I was seen online)
        var lastOnlineRef = app.database().ref('/users/' + userId + '/lastOnline');

        var connectedRef = app.database().ref('.info/connected');
        connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

                // When I disconnect, remove this device
                myConnectionsRef.onDisconnect().remove();

                // Add this device to my connections list
                // this value could contain info about the device or a timestamp too
                myConnectionsRef.set(true);

                // When I disconnect, update the last time I was seen online
                lastOnlineRef.onDisconnect().set(app.database.ServerValue.TIMESTAMP);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        firebase.logout();
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

        //добавляются записи на сервере для текущего пользователя 
        app.database().ref().child('tasks/' + app.auth().currentUser.uid + '/' + value.id).set({
            label: value.label,
            text: value.text,
            dateOfCreation: value.dateOfCreation,
            id: value.id,
        });


    }


    logout() {

        try {
            firebase.logout();
        } catch (error) {
            alert(error.message)
        }



        this.props.history.push('/');

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })

        if (e.target.value == '') {
            this.setState({
                searchBar: '',
                searchResult: [],
            })
        }
    }

    searchBar() {
        this.setState({
            isDiologOpen: false,
            searchResult: [],

        })

        let ref = app.database().ref('users');
        ref.orderByChild('surname').equalTo(this.state.searchBar).once('value', ((snapshot) => {

            snapshot.forEach((childSnapshot) => {

                this.state.searchResult.push(childSnapshot.val())

            });
        }));

        // if (this.state.searchResult == []) {
        //     alert('Пользователь не найден')
        // }
    }

  async  writeMessage(props) {

    //загуржается информация о пользователя для diologWindow(props)
    await  app.database().ref('users/' + props.id).once('value').then((snapshot) => {
       this.setState({userInfo:snapshot.val()})
      });

        this.setState({
            searchResult: [],
            isDiologOpen: true,
        });

      


    }

    //функция которая передается в props и отвечает за закрытие диалога
    closeWindow = (val) => {
        this.state.isDiologOpen = val;
        this.state.userInfo={};
    }

    //получение статуса оналйна пользователей
    onlineStatus(id) {
        app.database().ref('users').child(id).child('connections').on('value', (snapshot) => {
            this.state.diologs[this.state.diologs.findIndex(item => item.id === id)].online = snapshot.val()


        })
    }

    render() {


        return (

            <div className="main-container">


                <div className="left-side">
                    <nav className="icons-nav">
                        <a href="#" id="calendar-ref"> <svg id="calendar-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 5 0 L 5 4 L 7 4 L 7 0 Z M 17 0 L 17 4 L 19 4 L 19 0 Z M 1 3 C 0.449219 3 0 3.449219 0 4 L 0 7 C 0 7.550781 0.449219 8 1 8 L 1 24 L 23 24 L 23 8 C 23.550781 8 24 7.550781 24 7 L 24 4 C 24 3.449219 23.550781 3 23 3 L 20 3 L 20 5 L 16 5 L 16 3 L 8 3 L 8 5 L 4 5 L 4 3 Z M 3 8 L 21 8 L 21 22 L 3 22 Z M 5 10 L 5 12 L 7 12 L 7 10 Z M 9 10 L 9 12 L 11 12 L 11 10 Z M 13 10 L 13 12 L 15 12 L 15 10 Z M 17 10 L 17 12 L 19 12 L 19 10 Z M 5 14 L 5 16 L 7 16 L 7 14 Z M 9 14 L 9 16 L 11 16 L 11 14 Z M 13 14 L 13 16 L 15 16 L 15 14 Z M 17 14 L 17 16 L 19 16 L 19 14 Z M 5 18 L 5 20 L 7 20 L 7 18 Z M 9 18 L 9 20 L 11 20 L 11 18 Z M 13 18 L 13 20 L 15 20 L 15 18 Z M 17 18 L 17 20 L 19 20 L 19 18 Z" /></svg>
                        </a>
                        <a href="#" id="plus-ref"><ModalPlus id='plus-icon' updateData={this.updateData} /></a>
                    </nav>

                    <div id='tasks'>

                        {this.state.task.map(i =>
                            //вывод списка задач пользователя

                            <div className='task'>

                                <header id='taskHeader'>
                                    <p id='taskLabel'>{i.label}</p>
                                </header>


                                <main id='taskMain'>
                                    <p id='taskText'>{i.text}</p>
                                </main>


                                <footer id='taskFooter'>
                                    <p id='dateOfCreation'>{i.dateOfCreation}</p>
                                    <div className='taskIcons'>
                                        <a href="#" id='editLink' ><EditTask taskState={i} /></a>
                                        <a href="#" id='checkMarkLink'><svg id='checkMark' fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z" /></svg></a>
                                    </div>
                                </footer>

                            </div>

                        )}
                    </div>
                </div>





                <div className="center">
                    <header className="search-string">
                        <input id="searchBar" placeholder="Что нужно найти?" onChange={this.handleChange}></input>
                        <button onClick={this.searchBar} >Нажми</button>
                    </header>

                    <div className="centerContent">

                        {this.state.diologs.map(i =>




                            this.state.searchResult.length === 0 && this.state.isDiologOpen === false &&

                            <div className="resultField" >

                                {this.onlineStatus(i.id)}

                                <img src="/images/noavatar.png" id="userImage" />
                                <p className="userName">{i.displayName} - </p>
                                <p>- {i.lastMessage}</p>

                                <button onClick={() => this.writeMessage(i)}>Написать сообщение</button>
                                {i.online ? <p>Online</p> : <p>Offline</p>}



                            </div>
                        )}






                        {this.state.searchResult.map(i =>
                            //вывод найденных пользователей

                            this.state.isDiologOpen === false &&

                            <div className="resultField" >
                                <img src="/images/noavatar.png" id="userImage" />
                                <p className="userName">{i.name} {i.surname}</p>

                                <button onClick={() => this.writeMessage(i)}>Написать сообщение</button>
                                {i.connections ? <p>Online</p> : <p>Offline</p>}

                            </div>





                        )}

                        {this.state.isDiologOpen === true && <DiologWindow user={this.state.userInfo} closeWindow={this.closeWindow} />}




                    </div>

                </div>

                <aside className="right-side">
                    <p id="timer">{this.state.date.toLocaleTimeString()}</p>
                    <p>{this.addZero(this.state.date.getDate())}.{this.addZero(this.state.date.getMonth() + 1)}.{this.state.date.getFullYear()}</p>
                    <p>{firebase.getCurrentUsername()}</p>
                    <div><button onClick={this.logout}>Выход</button></div>
                </aside>

            </div>








        )
    }






}

export default MainPage