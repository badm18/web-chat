import React, { Component } from 'react';
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import './modalPlus.css';




class ModalPlus extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.save = this.save.bind(this);
    this.labelChange = this.labelChange.bind(this);
    this.textChange = this.textChange.bind(this);

    this.state = {
      show: false,
      label: '',
      text: '',
      date: new Date(),
      id:0,
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

  save() {
    this.setState({ 
      show: false,
      id: this.state.id+1,
     });
    if (this.state.text !== '') {
      this.props.updateData(
        {
          label: this.state.label,
          text: this.state.text,
          dateOfCreation: new Date(),
          id:this.state.id,
        }
      )
    }
  }

  labelChange(event) {
    this.setState({
      label: event.target.value
    })
  }

  textChange(event) {
    this.setState({
      text: event.target.value
    })
  }

  render() {
    return (
      <>
        <svg onClick={this.handleShow} id="plus-icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path fill-rule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z" /></svg>
        <Modal classname="Modal" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Новая задача</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Заголовок:</p>

            <InputGroup>
              <FormControl aria-label="Username" aria-describedby="basic-addon1" onChange={this.labelChange} value={this.state.label} />
            </InputGroup>
            <p>Текст:</p>
            <InputGroup>
              <FormControl as="textarea" aria-label="With textarea" onChange={this.textChange} />
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

export default ModalPlus