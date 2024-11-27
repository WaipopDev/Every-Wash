import React, { useEffect, useCallback, useState, useRef } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form,
    InputGroup,
    Tabs,
    Tab,
    Table
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { Ui } from '../../redux/actions'

import { Database } from '../../firebase'

import _ from 'lodash'

const TabLanguage = (props) => {
    const { language } = props
    const refForm = useRef(null)
    const [listLang, setListLang] = useState({})
    const [showLang, setShowLang] = useState({ isShow: false })
    const [validated, setValidated] = useState(false)

    const getAllLang = useCallback(async () => {
        const res = await Database.GetAllLanguage()
        const data = res.val()
        let list = {}
        _.map(data.list, (val, key) => {
            list[key] = data[key]
        })
        setListLang(list)
    }, [])

    useEffect(() => {
        getAllLang()
    }, [getAllLang])

    const handleClose = () => {
        setShowLang({ isShow: false })
    }

    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                if(showLang.key && showLang.data){
                    let data = {}
                    _.map(showLang.data, (val, key) => {
                        data[key] = form[key].value
                    })
                    await Database.UpdateDetailLanguage(showLang.key, data)
                    await getAllLang()
                }
                handleClose()
                setValidated(false);
            } else {
                setValidated(true);
            }

        } catch (error) {
            console.log(`error`, error)
        }
    }
    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Body>
                            <Tabs defaultActiveKey="EN" className="mb-3" >
                                {
                                    _.map(listLang, (val, key) => {
                                        return (
                                            <Tab key={key} eventKey={key} title={key} defaultChecked>
                                                <div className="pb-2 d-flex justify-content-end">
                                                    <Button variant="warning" onClick={() => setShowLang({ isShow: true, data: val, key: key })}>
                                                        <i className="fas fa-edit"></i> {language['language_edit']}
                                                    </Button>
                                                </div>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>{language['language_title_2']}</th>
                                                            <th>{language['language_title_3']}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            _.map(val, (value, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key}</td>
                                                                        <td>{value}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                        )
                                    })
                                }
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showLang.isShow} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{showLang.key}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} ref={refForm} >
                        {
                            _.map(showLang.data, (val, key) => {
                                return (
                                    <Form.Group as={Col} key={key} className="d-flex py-1">
                                        <Col md={5}>
                                            <Form.Label>{key}</Form.Label>
                                        </Col>
                                        <Col>
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    type="text"
                                                    name={key}
                                                    placeholder={key}
                                                    defaultValue={val}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                )
                            })
                        }
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
export default connect(mapStateToProps, mapDispatchToProps)(TabLanguage)