import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap';
import './diologWindow.css'
import * as app from "firebase/app";
import Uploader from "../Uploader/uploader"



class DiologWindow extends Component {

    constructor(props, context) {
        super(props, context);



        this.sentMessage = this.sentMessage.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            isDiologOpen: false,
            user: [],
            messages: [],
            messageInput: '',
            file: [],
            progress: 0,
            loaded: false,
            loading: true,
            messageCounter: '',

        }




    }



    async componentDidMount() {
        this.setState({ loded: false })

        //загрузка сообщений
        await app.database().ref('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).limitToLast(10).once('value').then((snapshot) => {
            snapshot.forEach((element) => {
                this.state.messages.push(element.val());

            })
            if (this.state.messages[0] != undefined) {
                this.setState({
                    messageCounter: this.state.messages[0].messageId,
                })
            }
        });

        this.setState({
            loading: false,
        })

       


        //слушатель для загрузки отправленных сообщений
        app.database().ref('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).limitToLast(10).on('child_added', (data) => {
            if (this.state.messages.findIndex(item => item.messageId === data.val().messageId) === -1) {
                this.state.messages.push(data.val());
            }
        });
    }





    closeWindow() {
        this.state.messages = [];
        this.props.closeWindow(false, this.props.user);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    async sentMessage() {

        let messageValue = this.state.messageInput;
        this.state.messageInput = '';
        if (messageValue != '' || this.state.file[0] != undefined) {
            app.database().ref().child('/messages/' + this.props.user.id + '/' + app.auth().currentUser.uid).push({
                text: messageValue,
                sender: app.auth().currentUser.uid,

            }).then(async function (messageRef) {


                app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                    messageId: messageRef.key,
                    text: messageValue,
                    sender: app.auth().currentUser.uid,
                });

                app.database().ref().child('/messages/' + this.props.user.id + '/' + app.auth().currentUser.uid).child(messageRef.key).update({
                    messageId: messageRef.key,

                });
                if (this.state.file[0]) {
                    // 2 - Upload the image to Cloud Storage.
                    var file = this.state.file[0];
                    var filePath = app.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
                    var uploadTask = app.storage().ref(filePath).put(file);

                    uploadTask.on(app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                        function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            this.setState({
                                progress: progress
                            })

                            console.log('Upload is ' + progress + '% done');

                        }.bind(this), function (error) {

                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    break;

                                case 'storage/canceled':
                                    // User canceled the upload
                                    break;

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    break;
                            }
                        }, await function () {
                            // Upload completed successfully, now we can get the download URL
                            this.state.progress = 0;
                            uploadTask.snapshot.ref.getDownloadURL().then(async function (url) {

                                await messageRef.update({
                                    fileUrl: url,
                                    storageUri: uploadTask.snapshot.metadata.fullPath,
                                    fileName: file.name
                                });
                                await app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                                    fileUrl: url,
                                    storageUri: uploadTask.snapshot.metadata.fullPath,
                                    fileName: file.name

                                })

                            }.bind(this));
                        }.bind(this));
                    await app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                        text: messageValue,
                        sender: app.auth().currentUser.uid,
                    })
                }
            }.bind(this));
            await app.database().ref().child('/diologs/' + app.auth().currentUser.uid + '/' + this.props.user.id).update({
                lastMessage: messageValue,
                timestamp: app.database.ServerValue.TIMESTAMP,
                id: this.props.user.id,
                displayName: this.props.user.name + ' ' + this.props.user.surname,

            })
            await app.database().ref().child('/diologs/' + this.props.user.id + '/' + app.auth().currentUser.uid).update({
                lastMessage: messageValue,
                timestamp: app.database.ServerValue.TIMESTAMP,
                id: app.auth().currentUser.uid,
                displayName: app.auth().currentUser.displayName,
            })
        }
    }
    // скролит в самый низ диалога при открытии диалогового окна
    scrollToBottom = () => {
        if (this.state.loaded != true) {
            var block = document.getElementById("aaaa");
            block.scrollTop = 9999;
            this.setState({ loaded: true })
        }
    }

    async onScroll() {
        if (document.getElementById("aaaa").scrollTop === 0) {
            //объявление нового массива для хранения подгруженных 10 сообщений
            let loadedMessages = [];

            await app.database().ref('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).orderByChild('messageId').endAt(this.state.messageCounter).limitToLast(10).once('value').then((snapshot) => {
                snapshot.forEach((element) => {
                    if (this.state.messages.findIndex(item => item.messageId === element.val().messageId) === -1) {
                        loadedMessages.push(element.val());
                    }
                })

                //если пользоветель находится в самом верху диалога, то данные не будут подгружаться
                if (loadedMessages.length > 0) {
                    this.setState({
                        messageCounter: loadedMessages[loadedMessages.length - 1].messageId,
                    })
                }
            });

            this.setState({
                messages: loadedMessages.concat(this.state.messages),
            })
        }
    }


    fileState = (file) => {
        this.state.file[0] = file;
    }

    //последний раз когда собеседник был в сети
    lastOnline() {
        let date = new Date(this.props.user.lastOnline);
        return 'last seen ' + this.addZero(date.getDate()) + '.' + this.addZero(date.getMonth() + 1) + '.' + date.getFullYear() + ' at ' + this.addZero(date.getHours()) + ':' + this.addZero(date.getMinutes())
    }
    //добавляет 0 в дни и месяцы
    addZero(num) {
        if (num <= 9) return '0' + num;
        else return num;
    }



    render() {


        if (this.state.loading) {
            return (
                <Spinner animation="border" role="status" id="spinner">
                    <span className="sr-only">Loading...</span>
                </Spinner>); // отображение загрузки
        }

        return (
            <div className="diologField">

                <header className="diologheader">

                    <div className="headerLeft">
                        <img src={this.props.user.ProfilePicture} id="userImage" />
                        <div id='nameNonline'>
                            <p id="displayName">{this.props.user.name} {this.props.user.surname}</p>
                            <p id="lastOnline">{this.props.user.connections === true ? 'Online' : this.lastOnline()} </p>
                        </div>
                    </div>


                    <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" height="32" width="32" id="crossMark" onClick={this.closeWindow} id="crossMark" ><path d="M4,29a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l24-24a1,1,0,1,1,1.42,1.42l-24,24A1,1,0,0,1,4,29Z" /><path d="M28,29a1,1,0,0,1-.71-.29l-24-24A1,1,0,0,1,4.71,3.29l24,24a1,1,0,0,1,0,1.42A1,1,0,0,1,28,29Z" /></svg>
                </header>



                <div className="messageField" id="aaaa" onLoad={this.scrollToBottom} onScroll={this.onScroll}>

                    {this.state.messages.map(i =>
                        <div className="message" >
                            {i.sender === app.auth().currentUser.uid ? <img src={this.props.interlocutor.ProfilePicture} id="userImage" /> : <img src={this.props.user.ProfilePicture} id="userImage" />}


                            <div className={i.sender === app.auth().currentUser.uid ? 'messageBox--Sender' : 'messageBox'}>
                                <p>{i.text}</p>
                                {i.fileUrl ? <a href={i.fileUrl} target="_blank">{i.fileName}</a> : <a></a>}


                            </div>



                        </div>

                    )}



                </div>


                <footer className="diologFooter">
                    <input id="messageInput" onChange={this.handleChange} value={this.state.messageInput} />
                    <div className="footerIcons">
                        <svg onClick={this.sentMessage} version="1.1" id="sent-icon" xmlns="http://www.w3.org/2000/svg" height="30px" width="50px"
                            viewBox="0 0 512 512" >

                            <path d="M506.134,241.843c-0.006-0.006-0.011-0.013-0.018-0.019l-104.504-104c-7.829-7.791-20.492-7.762-28.285,0.068
			c-7.792,7.829-7.762,20.492,0.067,28.284L443.558,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h423.557
			l-70.162,69.824c-7.829,7.792-7.859,20.455-0.067,28.284c7.793,7.831,20.457,7.858,28.285,0.068l104.504-104
			c0.006-0.006,0.011-0.013,0.018-0.019C513.968,262.339,513.943,249.635,506.134,241.843z"/>


                        </svg>
                        <Uploader file={this.fileState} progress={this.state.progress} id="upload-icon" />
                    </div>




                </footer>
            </div>





        )
    }






}

export default DiologWindow