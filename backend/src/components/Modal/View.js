import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Modal,
    Form,
    Alert,
    Spinner
} from 'react-bootstrap'
import _ from 'lodash'

export const View = (props) => {
    const { show, title, children, handleSubmit, handleClose } = props
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {"Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(View)
