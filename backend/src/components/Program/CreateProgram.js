import React, { useState, createRef, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { Firestore } from '../../firebase'
import { Program } from '../../redux/actions'

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form,
    InputGroup
} from 'react-bootstrap'
import _ from 'lodash'

export const CreateProgram = (props) => {
    const { userData, getProgramWashingMachine, getProgramClothesDryer, branchData, permission, language } = props
    const [show, setShow] = useState({ isShow: false });
    const [validated, setValidated] = useState(false);
    const [branch, setBranch] = useState('')

    const refForm = createRef()


    const handleClose = () => {
        setShow({ isShow: false })
        setValidated(false)
    }
    const handleShow = (type) => {
        setShow({
            isShow: true,
            type
        });
    }

    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                if (show.type === 1) {
                    await Firestore.ProgramWashingMachine().add({
                        status          : 1,
                        name            : form['name'].value,
                        size            : form['size'].value,
                        price           : Number(form['price'].value),
                        time            : Number(form['time'].value),
                        createAt        : moment().unix(),
                        createBy        : userData.id,
                        modifyAt        : '',
                        modifyBy        : '',
                        waterTemperature: form['waterTemperature'].value,
                        branch          : form['branch'].value
                    })
                    await getProgramWashingMachine()
                    handleClose()
                } else if (show.type === 2) {
                    await Firestore.ProgramClothesDryer().add({
                        status          : 1,
                        name            : form['name'].value,
                        size            : form['size'].value,
                        price           : Number(form['price'].value),
                        time            : Number(form['time'].value),
                        createAt        : moment().unix(),
                        createBy        : userData.id,
                        modifyAt        : '',
                        modifyBy        : '',
                        waterTemperature: form['waterTemperature'].value,
                        branch          : form['branch'].value
                    })
                    await getProgramClothesDryer()
                    handleClose()
                }
                setValidated(false);
            }else{
                setValidated(true);
            }
            
        } catch (error) {
            console.log(`error`, error)
        }

    };
    return (
        <div>
            <Container fluid>
                <Row className="py-md-4">
                    <Col>
                        <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                            <Card.Body>
                                <Row className="pb-3">
                                    <Col>
                                        <h4 className="mb-0">{language['program_management']}</h4>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col md={3}>
                                        <Button onClick={() => handleShow(1)} variant="info" style={{backgroundColor:'#7DB0D1',borderColor:'#7DB0D1'}}>
                                        <i className="fas fa-plus"></i> {language['program_add_washing']}
                                        </Button>
                                    </Col>
                                    <Col md={3}>
                                        <Button onClick={() => handleShow(2)} variant="warning" style={{backgroundColor:'#FE7F83',borderColor:'#FE7F83'}}>
                                        <i className="fas fa-plus"></i> {language['program_add_dryer']}
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal show={show.isShow} onHide={handleClose}>
                    {
                        !_.isUndefined(show.type) &&
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>{show.type === 1 ? language['program_add_washing'] : language['program_add_dryer']}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} ref={refForm} >
                                    <Form.Group as={Col}>
                                        <Form.Label>{language['program_title_1']}</Form.Label>
                                            <Form.Select
                                                // onChange={(e) => { setBranch(e.target.value) }}
                                                name={'branch'}
                                                required
                                            >
                                                <option value={''}>{language['program_title_2']}</option>
                                                {branchData.map((res, index) => {
                                                    if (permission.length) {
                                                        if (_.find(permission, e => e.docId === res.docId)) {
                                                            return (
                                                                <option key={index} value={res.docId}>{res.name}</option>
                                                            )
                                                        }
                                                    } else {
                                                        return (
                                                            <option key={index} value={res.docId}>{res.name}</option>
                                                        )
                                                    }
                                                })}
                                            </Form.Select>
                                       
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>{language['global_program_name']}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder={`${language['global_program_name']} ...`}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>{language['global_tank_size']}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="text"
                                                name="size"
                                                placeholder={`${language['global_tank_size']} ...`}
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>{show.type === 1 ? language['program_title_3']:language['program_title_4']}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="text"
                                                name="waterTemperature"
                                                placeholder={show.type === 1 ? `${language['program_title_3']} ...`:`${language['program_title_4']} ...`}
                                                required
                                            />
                                            <InputGroup.Text>°C</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>{language['global_price']}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                placeholder="30"
                                                aria-describedby="basic-addon1"
                                                required
                                            />
                                            <InputGroup.Text id="basic-addon1">{language['global_baht']}</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>{language['program_title_5']}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="number"
                                                name="time"
                                                placeholder="30"
                                                required
                                            />
                                            <InputGroup.Text>{language['program_title_6']}</InputGroup.Text>
                                        </InputGroup>

                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                <i className="fas fa-window-close"></i> {language['global_close']}
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>
                                <i className="fas fa-save"></i> {language['global_save']}
                                </Button>
                            </Modal.Footer>
                        </>
                    }

                </Modal>
            </Container>
        </div>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData, permission },
        branch: { data: branchData },
        ui:{language}
    } = state
    return {
        userData,
        branchData,
        permission,
        language
    }
}

const mapDispatchToProps = {
    getProgramWashingMachine: Program.getProgramWashingMachine,
    getProgramClothesDryer: Program.getProgramClothesDryer
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram)
