import React, { Component } from 'react'
import './diologWindow.css'
import * as app from "firebase/app";
import Uploader from "../Uploader/uploader"



class DiologWindow extends Component {

    constructor(props, context) {
        super(props, context);



        this.sentMessage = this.sentMessage.bind(this);
        this.closeWindow = this.closeWindow.bind(this);

        this.state = {
            isDiologOpen: false,
            user: [],
            messages: [],
            messageInput: '',
            file: [],
            progress: 0,
        }




    }


    componentDidMount() {

        // window.scrollTo(0, document.body.scrollHeight);

       
        app.database().ref('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).on('child_added', (data) => {
            this.state.messages.push(data.val());
          
        });

        app.database().ref('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).on('child_changed', (data) => {
           this.state.messages[this.state.messages.findIndex(item=>item.messageId===data.val().messageId)]=data.val();
        });




        // var connectedRef = app.database().ref(".info/connected");
        // connectedRef.on("value",function(snap) {
        //     if (snap.val() === true) {
        //         alert("connected");
        //     } else {
        //         alert("not connected");
        //     }
        // });
    }



    closeWindow() {
        this.state.messages = [];
        this.props.closeWindow(false);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    async  sentMessage() {

        if (this.state.messageInput != '' || this.state.file[0] != '') {

           

            app.database().ref().child('/messages/' + this.props.user.id + '/' + app.auth().currentUser.uid).push({
                text: this.state.messageInput,
                sender: app.auth().currentUser.uid,

            }).then(async function (messageRef) {


                app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                    messageId:messageRef.key,
                    text: this.state.messageInput,
                    sender: app.auth().currentUser.uid,
                });

                app.database().ref().child('/messages/' + this.props.user.id + '/' + app.auth().currentUser.uid).child(messageRef.key).update({
                    messageId:messageRef.key,
                   
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
                            uploadTask.snapshot.ref.getDownloadURL().then(async function (url) {

                                await messageRef.update({
                                    fileUrl: url,
                                    storageUri: uploadTask.snapshot.metadata.fullPath
                                });
                                await app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                                    fileUrl: url,
                                    storageUri: uploadTask.snapshot.metadata.fullPath,
                                    
                                })


                            }.bind(this));

                        }.bind(this));


                    await app.database().ref().child('/messages/' + app.auth().currentUser.uid + '/' + this.props.user.id).child(messageRef.key).update({
                        text: this.state.messageInput,
                        sender: app.auth().currentUser.uid,
                        
                    })


                }





            }.bind(this));










            // await app.database().ref().child('/messages/' + this.props.user.id + '/' + app.auth().currentUser.uid).push({
            //     text: this.state.messageInput,
            //     sender: app.auth().currentUser.uid
            // }).then(function (messageRef) {
            //     if (this.state.file[0]) {

            //         messageRef.update({
            //             fileUrl:this.state.messages[0],
            //             storageUri: fileSnapshot.metadata.fullPath
            //         })


            //     }


            // })

            await app.database().ref().child('/diologs/' + app.auth().currentUser.uid + '/' + this.props.user.id).update({
                lastMessage: this.state.messageInput,
                timestamp: app.database.ServerValue.TIMESTAMP,
                id: this.props.user.id,
                displayName: this.props.user.name + ' ' + this.props.user.surname,

            })


            await app.database().ref().child('/diologs/' + this.props.user.id + '/' + app.auth().currentUser.uid).update({
                lastMessage: this.state.messageInput,
                timestamp: app.database.ServerValue.TIMESTAMP,
                id: app.auth().currentUser.uid,
                displayName: app.auth().currentUser.displayName,

            })





        }

     



    }


    fileState = (file) => {

        this.state.file[0] = file;

    }




    render() {
        return (
            <>

                <div className="diologField">

                    <header className="diologheader">
                        <div className="headerLeft">
                            <img src="/images/noavatar.png" id="userImage" />
                            <p>{this.props.user.name} {this.props.user.surname}</p>
                        </div>
                        <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" height="32" width="32" id="crossMark" onClick={this.closeWindow} id="crossMark" ><path d="M4,29a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l24-24a1,1,0,1,1,1.42,1.42l-24,24A1,1,0,0,1,4,29Z" /><path d="M28,29a1,1,0,0,1-.71-.29l-24-24A1,1,0,0,1,4.71,3.29l24,24a1,1,0,0,1,0,1.42A1,1,0,0,1,28,29Z" /></svg>
                    </header>



                    <div className="messageField">
                        {this.state.messages.map(i =>
                            <div className="message">
                                <img src="/images/noavatar.png" id="userImage" />

                                <div className={i.sender === app.auth().currentUser.uid ? 'messageBox--Sender' : 'messageBox'}>
                                    <p>{i.text}</p>
                                    {i.fileUrl ? <a href={i.fileUrl}> скачать файл</a> : <a></a>}
                                    

                                </div>



                            </div>

                        )}



                    </div>


                    <footer className="diologFooter">
                        <input id="messageInput" onChange={this.handleChange} />
                        <button onClick={this.sentMessage}>Press me</button>
                        <Uploader file={this.fileState} progress={this.state.progress} />

                    </footer>
                </div>


            </>


        )
    }






}

export default DiologWindow