import React, { Component } from 'react';
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';

import * as app from "firebase/app";



class ModalPic extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.save= this.save.bind(this);

        this.state = {
            show: false,
            file: [],
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({
            show: true,
            label: '',
            text: '',
        });
    }

   async save() {
        if(this.state.file[0]!=undefined){
            var file = this.state.file[0];
                    var filePath = '/avatar/' + app.auth().currentUser.uid + '/';
                    var uploadTask = app.storage().ref(filePath).put(file);

                    uploadTask.on(app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                        function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          

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
                               
                               
                                await app.database().ref().child('/users/' + app.auth().currentUser.uid).update({
                                    ProfilePicture: url,
                                })

                            }.bind(this));
                        }.bind(this));

                        this.setState({ show: false });
        }



    }


    chooseFile = (e) => {
        this.state.file[0] = e.target.files[0];


        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').setAttribute('src', e.target.result);
        }

        reader.readAsDataURL(e.target.files[0]);


    }

    render() {
        return (
            <>
                <a onClick={this.handleShow} id="changePicture">Изменить аватар</a>
                <Modal classname="Modal" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Изображение</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <div className="upload-icon">
                            {/* <progress value={this.props.progress} max="100" /> */}
                            <div id='testing'>
                                <input type="file" accept="image/*" onChange={this.chooseFile} />
                                <img width="50px" height="50px" id="preview" ></img>
                            </div>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose} >
                            Отмена
                  </Button>

                        <Button variant="primary" onClick={this.save}>
                            Сохранить
                  </Button>

                    </Modal.Footer>
                </Modal>
            </>

        );
    }

}

export default ModalPic