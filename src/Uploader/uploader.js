import React, { Component } from "react";
import firebase from "firebase/app";
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';

class Uploader extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            file: [],
            progress: 0,
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }


    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        !this.state.show ? this.setState({ show: true }) : this.setState({ show: false });
    }

    chooseFile = (e) => {
        this.state.file[0] = e.target.files[0];

        this.props.file(e.target.files[0])

    }

    handleUpload = () => {
        // File or Blob named mountains.jpg
        var file = this.state.file[0]

      

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = firebase.storage().ref().child(file.type + '/' + file.name).put(file);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({
                    progress: progress
                })

                console.log('Upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
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
            }, function () {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at', downloadURL);

                });
                this.setState({ show: false });
            }.bind(this));


    }






    render() {
        return (
            <>
                <svg version="1.1" id="clip" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 792.025 792.025" onClick={this.handleShow} >
                    <path d="M334.189,259.875c0,6.832-5.569,12.375-12.375,12.375c-6.832,0-12.375-5.543-12.375-12.375
c0-23.848,9.745-45.53,25.42-61.205l0.825-0.773c15.624-15.211,36.944-24.647,60.328-24.647c23.77,0,45.426,9.771,61.126,25.472
l0.025-0.025c15.676,15.675,25.447,37.383,25.447,61.179c0,6.832-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375
c0-16.99-6.988-32.458-18.176-43.673l0.024-0.026l-0.053-0.026C428.522,204.987,413.028,198,396.012,198
c-16.681,0-31.943,6.703-43.029,17.505l-0.619,0.67C341.15,227.391,334.189,242.859,334.189,259.875z"/>
                    <path d="M482.612,655.875c0,6.807-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375V259.849
c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375V655.875z"/>
                    <path d="M334.189,668.198c0,6.832-5.569,12.375-12.375,12.375c-6.832,0-12.375-5.543-12.375-12.375V259.849
c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375V668.198z"/>
                    <path d="M309.387,668.225c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375c0,27.25,11.163,52.053,29.056,69.996
c17.892,17.893,42.667,29.029,69.892,29.029c27.228,0,52.002-11.163,69.867-29.056c17.945-17.943,29.082-42.745,29.082-69.971
c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375c0,33.979-13.947,64.942-36.353,87.372
c-22.43,22.456-53.393,36.43-87.397,36.43s-64.969-13.947-87.398-36.402C323.309,733.193,309.387,702.229,309.387,668.225z"/>
                    <path d="M556.862,668.198c0,6.832-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375V160.849
c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375V668.198z"/>
                    <path d="M259.913,160.875c0,6.832-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375
c0-44.215,18.098-84.434,47.206-113.566l0.025-0.026l-0.025-0.051C311.501,18.099,351.746,0,395.986,0
c44.163,0,84.355,18.099,113.515,47.257l0.025,0.026l0.026,0.026l0.025,0.026c29.158,29.184,47.256,69.429,47.256,113.541
c0,6.832-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375c0-37.409-15.312-71.491-39.934-96.112l-0.078-0.052
c-24.646-24.647-58.652-39.961-96.087-39.961c-37.409,0-71.44,15.34-96.112,39.987l-0.026-0.026
C275.227,89.384,259.913,123.415,259.913,160.875z"/>
                    <path d="M259.939,680.625c0,6.832-5.543,12.375-12.375,12.375s-12.375-5.543-12.375-12.375V160.849
c0-6.832,5.543-12.375,12.375-12.375s12.375,5.543,12.375,12.375V680.625z"/>

                </svg>






                {this.state.show === true &&
                    <div>
                        <progress value={this.props.progress} max="100" />
                        <div>
                            <input type="file" onChange={this.chooseFile} />
                         
                        </div>
                    </div>
                }














            </>
        );
    }
}

export default Uploader;