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

export const index = (props) => {
    const { item, submit, configModal, renderItem = null, language } = props
    const [show, setShow] = useState(false)
    const [validated, setValidated] = useState(false);

    const refForm = createRef()
    useEffect(() => {
        if (!_.isUndefined(item) && item.length) {
            handleShow()
            setValidated(false)
        } else {
            handleClose()
        }
    }, [item])
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleSubmit = () => {
        const form = refForm.current
        if (form.checkValidity() === true) {
            submit(form)
            // handleClose()
        }
        setValidated(true);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{configModal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    configModal.errorMsg &&
                    <Alert variant={'danger'}>
                        {configModal.errorMsg}
                    </Alert>
                }
                 {
                    configModal.successMsg &&
                    <Alert variant={'success'}>
                        {configModal.successMsg}
                    </Alert>
                }
                <Form noValidate validated={validated} ref={refForm} >
                    {
                        !_.isUndefined(item) && item.length &&
                        item.map((res, index) => {
                            if (!_.isUndefined(res._type)) {
                                return (
                                    <Form.Control
                                        key={index}
                                        type={'hidden'}
                                        name={res.name}
                                        required={true}
                                        defaultValue={res.value}
                                    />
                                )
                            }

                            if (res.type === 'select') {
                                return (
                                    <Form.Group key={index} as={Col} className="pb-2">
                                        <Form.Label>{res.label}</Form.Label>
                                        <Form.Select
                                            name={res.name}
                                            required={true}
                                            defaultValue={res.value || ''}
                                        >
                                            {
                                                res.option.map((resSelect, indexSelect) => (<option key={`op-${indexSelect}`} value={resSelect.value}>{resSelect.name}</option>))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                )
                            }

                            return (
                                <Form.Group key={index} as={Col} className="pb-2">
                                    <Form.Label>{res.label}</Form.Label>
                                    <Form.Control
                                        type={res.type ? res.type : 'text'}
                                        name={res.name}
                                        placeholder={res.placeholder ? res.placeholder : ''}
                                        required={res.required ? res.required : false}
                                        defaultValue={res.value ? res.value : ''}
                                    />
                                </Form.Group>
                            )
                        })
                    }
                    {
                      !_.isNull(renderItem) ?  renderItem() : null
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                <i className="fas fa-window-close"></i> {language['global_cancel']}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {configModal.pending ? <Spinner animation="border" variant="light" /> : <><i className="fas fa-save"></i> {language['global_save']}</>}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    const {
        ui: {language }
    } = state
    return {
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(index)
