import React, { Component } from 'react'
import './mainPage.css';
import ModalPlus from '../ModalPlus/modalPlus';
import EditTask from '../EditTask/editTask';
import * as app from "firebase/app";
import firebase from '../firebase'
import DiologWindow from '../diologWindow/diologWindow';
import ModalPic from '../ProfilePic/profilepic';



class MainPage extends Component {
    constructor(props) {
        super();

        this.state = {
            date: new Date(),
            diologs: [],
            task: [],
            searchBar: '',
            searchResult: [],
            isDiologOpen: false,
            userInfo: {},
            users: [],
            online: [],
            file: [],
            interlocutor: {},
        }



        this.time = this.time.bind(this);
        this.addZero = this.addZero.bind(this);
        this.logout = this.logout.bind(this);
        this.searchBar = this.searchBar.bind(this);
        this.writeMessage = this.writeMessage.bind(this);
        this.onlineStatus = this.onlineStatus.bind(this);
    }


    async componentDidMount() {
        let userId = app.auth().currentUser.uid;
        this.timerID = setInterval(
            () => this.time()
            , 1000);

        //Загрузка списка задач для пользователя
        await app.database().ref('tasks/' + userId).once('value').then((snapshot) => {
            snapshot.forEach((element) => {
                this.state.task.push(element.val());
            });
        });
        //загрузка информации о пользователях с которыми есть диалог
        await app.database().ref('diologs/' + userId).once('value').then((snapshot) => {
            snapshot.forEach((element) => {

                this.getProfilePicture(element.val().id)
            });
        })
        //загрузка диологов пользователя
        app.database().ref('diologs/' + userId).on('child_added', (snapshot) => {
            this.state.diologs.push(snapshot.val());
        })
        //Загрузка последнего сообщения которое было отправлено
        app.database().ref('diologs/' + userId).on('child_changed', (snapshot) => {
            this.state.diologs[this.state.diologs.findIndex(item => item.id === snapshot.val().id)] = snapshot.val()
        })
        //обновление данных о пользователе, если он поменял аватарку
        app.database().ref('users/').on('child_changed', (snapshot) => {
            this.state.users[this.state.users.findIndex(item => item.id === snapshot.val().id)] = snapshot.val()
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

    //удаление заметки
    deleteTask(e) {
        app.database().ref('tasks/' + app.auth().currentUser.uid + '/' + e.id).remove();
        this.state.task.splice(this.state.task.findIndex(item => item.id === e.id), 1);
    }

    async searchBar() {
        await this.setState({
            isDiologOpen: false,
            searchResult: [],

        })

        let ref = app.database().ref('users');
        await ref.orderByChild('surname').equalTo(this.state.searchBar).once('value', ((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                this.state.searchResult.push(childSnapshot.val())
            });
        }));


    }

    async writeMessage(props) {
        //загуржается информация о пользователе для diologWindow(props)
        await app.database().ref('users/' + props.id).once('value').then((snapshot) => {
            this.setState({ userInfo: snapshot.val() })
        });
        await app.database().ref('users/' + app.auth().currentUser.uid).once('value').then((snapshot) => {
            this.state.users.push(snapshot.val())
        });
        //слушатель изменений информации о пользователе(онлайн)
        app.database().ref('users/' + props.id).on('value',(data)=>{
            this.setState({ userInfo: data.val() })
        })
        
        this.setState({
            searchResult: [],
            searchBar: '',
            isDiologOpen: true,
        });
    }

    //функция которая передается в props и отвечает за закрытие диалога
    closeWindow = (val, user) => {
        this.state.isDiologOpen = val;
        //добавление в массив информации о пользователе с которым был начат новый диалог
        this.state.users.push(user)
        this.state.userInfo = {};
    }

    //получение статуса онлайна пользователей
    onlineStatus(id) {
        app.database().ref('users').child(id).child('connections').on('value', (snapshot) => {
            this.state.diologs[this.state.diologs.findIndex(item => item.id === id)].online = snapshot.val()


        })
    }
    // если в сообщении много текста, то для вывода в диалоге последнего сообщения текст сокращается
    lastMessage(string) {
        if (string.length > 10) {
            return string.substr(0, 70) + '...'
        }
        return string
    }

    async getProfilePicture(id) {

        await app.database().ref('users/').child(id).once('value').then((snapshot) => {
            this.state.users.push(snapshot.val())
        })
    }



    render() {


        return (

            <div className="main-container">


                <div className="left-side">
                    <nav className="icons-nav">

                        <a href="#" id="plus-ref"><ModalPlus id='plus-icon' updateData={this.updateData} /></a>
                    </nav>

                    <div id='tasks'>

                        {this.state.task.map(i =>
                            //вывод списка задач пользователя

                            <div className='task' >

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
                                        <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" height="32" width="32" onClick={() => { this.deleteTask(i) }} id="crossMark" ><path d="M4,29a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l24-24a1,1,0,1,1,1.42,1.42l-24,24A1,1,0,0,1,4,29Z" /><path d="M28,29a1,1,0,0,1-.71-.29l-24-24A1,1,0,0,1,4.71,3.29l24,24a1,1,0,0,1,0,1.42A1,1,0,0,1,28,29Z" /></svg>

                                    </div>
                                </footer>

                            </div>

                        )}
                    </div>
                </div>





                <div className="center">
                    <header className="search-string">
                        <input id="searchBar" placeholder="Что нужно найти?" value={this.state.searchBar} onChange={this.handleChange}></input>
                        <svg id="search-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px" onClick={this.searchBar}><path d="M 7 4 C 5.3545455 4 4 5.3545455 4 7 L 4 43 C 4 44.645455 5.3545455 46 7 46 L 43 46 C 44.645455 46 46 44.645455 46 43 L 46 7 C 46 5.3545455 44.645455 4 43 4 L 7 4 z M 7 6 L 43 6 C 43.554545 6 44 6.4454545 44 7 L 44 43 C 44 43.554545 43.554545 44 43 44 L 7 44 C 6.4454545 44 6 43.554545 6 43 L 6 7 C 6 6.4454545 6.4454545 6 7 6 z M 22.5 13 C 17.26514 13 13 17.26514 13 22.5 C 13 27.73486 17.26514 32 22.5 32 C 24.758219 32 26.832076 31.201761 28.464844 29.878906 L 36.292969 37.707031 L 37.707031 36.292969 L 29.878906 28.464844 C 31.201761 26.832076 32 24.758219 32 22.5 C 32 17.26514 27.73486 13 22.5 13 z M 22.5 15 C 26.65398 15 30 18.34602 30 22.5 C 30 26.65398 26.65398 30 22.5 30 C 18.34602 30 15 26.65398 15 22.5 C 15 18.34602 18.34602 15 22.5 15 z" /></svg>

                    </header>

                    <div className="centerContent">

                        {this.state.diologs.map(i =>




                            this.state.searchResult.length === 0 && this.state.isDiologOpen === false &&

                            <div className="resultField" onClick={() => this.writeMessage(i)}>

                                {this.onlineStatus(i.id)}

                                <img src={this.state.users[this.state.users.findIndex(item => item.id === i.id)].ProfilePicture} alt="image" id="userImage" />
                                <div id="wasd">
                                    <p className="userName" id="displayName">{i.displayName}</p>

                                    <p id="lastMessage">  {this.lastMessage(i.lastMessage)}</p>
                                </div>

                                <div id="onlineStatus"><p>{i.online ? <p>Online</p> : <p>Offline</p>}</p></div>


                            </div>
                        )}




                     

                        {this.state.searchResult.map(i =>
                            //вывод найденных пользователей

                            this.state.isDiologOpen === false &&

                            <div className="resultField" onClick={() => this.writeMessage(i)} >
                                <img src={i.ProfilePicture} id="userImage" />
                                <p className="userName" id="displayName">{i.name} {i.surname}</p>


                                <div id="onlineStatus"><p>{i.online ? <p>Online</p> : <p>Offline</p>}</p></div>


                            </div>





                        )}

                        {this.state.isDiologOpen === true && <DiologWindow user={this.state.userInfo} closeWindow={this.closeWindow} interlocutor={this.state.users[this.state.users.findIndex(item => item.id === app.auth().currentUser.uid)]} />}




                    </div>

                </div>
                <div id="rightArea">
                    <div id="rightAside">
                        <aside className="right-side">
                            <p id="timer">{this.state.date.toLocaleTimeString()}</p>
                            {/* <p>{this.addZero(this.state.date.getDate())}.{this.addZero(this.state.date.getMonth() + 1)}.{this.state.date.getFullYear()}</p> */}
                            <p>{firebase.getCurrentUsername()}</p>
                            <div><button onClick={this.logout}>Выход</button></div>
                        </aside>
                    </div>
                    <div id="profileLink">
                        <a><ModalPic /></a>
                    </div>
                </div>
            </div>









        )
    }






}

export default MainPage