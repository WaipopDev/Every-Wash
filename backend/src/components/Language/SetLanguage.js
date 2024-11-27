import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Ui } from '../../redux/actions'
import { Database } from '../../firebase'
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup } from 'react-bootstrap'
import languageDefault from '../../../languageDefault.json'
import _ from 'lodash'

const SetLanguage = (props) => {
    const { language } = props
    const refForm = useRef(null)

    const [show, setShow] = useState({ isShow: false });
    const [validated, setValidated] = useState(false);


    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                const res = await Database.GetDetailLanguage(form['name'].value)
                if(res.val()){
                    await Database.AddLanguage(form['name'].value, Object.assign(languageDefault, res.val()))
                }else{
                    await Database.AddLanguage(form['name'].value, languageDefault)
                }
                window.location.reload()
                handleClose()
                setValidated(false);
            } else {
                setValidated(true);
            }

        } catch (error) {
            console.log(`error`, error)
        }
    }

    const handleClose = () => {
        setShow({ isShow: false })
        setValidated(false)
    }

    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Body>
                            <Row className="pb-3">
                                <Col>
                                    <h4 className="mb-0">{language['language_management']}</h4>
                                </Col>
                            </Row>
                            <Row className="align-items-center">
                                <Col md={3}>
                                    <Button onClick={() => setShow({ isShow: show })} variant="info" style={{ backgroundColor: '#7DB0D1', borderColor: '#7DB0D1' }}>
                                        <i className="fas fa-plus"></i> {language['language_add']}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={show.isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{language['language_add']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} ref={refForm} >
                        <Form.Group as={Col}>
                            <Form.Label>{language['language_title_1']}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="EN ..."
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <i className="fas fa-window-close"></i> {language['global_cancel']}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        <i className="fas fa-save"></i> {language['global_save']}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
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
    alertShow : Ui.alertShow
}

export default connect(mapStateToProps, mapDispatchToProps)(SetLanguage)