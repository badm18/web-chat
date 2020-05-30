import React, { Component } from 'react';
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import * as app from "firebase/app";





class EditTask extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.save = this.save.bind(this);



        this.state = {
            show: false,
            label: '',
            text: '',
            dateOfCreation: '',
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({
            show: true,
            label: this.props.taskState.label,
            text: this.props.taskState.text,
            dateOfCreation: this.props.taskState.dateOfCreation,
        });
    }




    handleChange=(e)=>{
        this.setState({
            [e.target.id]: e.target.value,
        })
    }


    save() {
        this.setState({
            show: false,
        });

        this.props.taskState.label = this.state.label;
        this.props.taskState.text = this.state.text;

        //Обновление данных на сервере 
        app.database().ref().child('/tasks/' + app.auth().currentUser.uid + '/'+this.props.taskState.id).update({
            label: this.state.label,
            text: this.state.text,
        })


    }







    render() {
        return (
            <>
                <svg onClick={this.handleShow} id='edit' fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px"><path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z" /></svg>
                <Modal classname="Modal" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Редактирование</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Заголовок:</p>

                        <InputGroup>
                            <FormControl id="label" aria-label="Username" aria-describedby="basic-addon1" onChange={this.handleChange} value={this.state.label} />
                        </InputGroup>
                        <p>Текст:</p>
                        <InputGroup>
                            <FormControl id="text" as="textarea" aria-label="With textarea" onChange={this.handleChange} value={this.state.text} />
                        </InputGroup>

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

export default EditTask