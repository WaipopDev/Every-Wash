import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Modal,
    Form,
    Spinner
} from 'react-bootstrap'
import _ from 'lodash'
import {  Ui } from '../../redux/actions'

export const Alert = (props) => {
    const { alertShow, title, message } = props

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if(message && !showModal){
            setShowModal(true)
        }
    }, [message])

    const handleClose = () => {
        setShowModal(false)
        alertShow('')
    }
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{'แจ้งเตือน'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {`ปิด`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    const {
        ui: { alert: {message} }
    } = state
    return {
        message
    }
}

const mapDispatchToProps = {
    alertShow:Ui.alertShow
}

export default connect(mapStateToProps, mapDispatchToProps)(Alert)
