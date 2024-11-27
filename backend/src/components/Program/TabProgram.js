import React, { useEffect, useState, createRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
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
import _ from 'lodash'
import { Program } from '../../redux/actions'

const RenderItemTable = (props) => {
    const { data, onEdit, onDelete, programSort, branchData, branch, type, language } = props
    let item = []
    let i = 1

    data.map((res, index) => {
        let check = true
        let checkBranch = true
        if (programSort) {
            check = false
            if (programSort === res.size) {
                check = true
            }
        }
        
        if(branch){
            checkBranch = false
            if(branch === res.branch){
                checkBranch = true
            }
        }
        if (check && checkBranch) {
            let nameBranch = ''
            if (res.branch) {
                const resBranch = _.find(branchData, (e) => e.docId === res.branch)
                if (resBranch) {
                    nameBranch = resBranch.name
                }
            }
            item.push(
                <tr key={index}>
                    <td className="px-2">{i}</td>
                    <td className="px-2">{res.name}</td>
                    <td className="px-2">{res.size}</td>
                    <td className="px-2">{res.waterTemperature}</td>
                    <td className="px-2">{res.price}</td>
                    <td className="px-2">{res.time}</td>
                    <td className="px-2">{nameBranch}</td>
                    <td className="px-2 d-flex justify-content-between">
                        <Button variant="link" className="py-0 btn-edit" onClick={() => onEdit(res)}>
                            <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="link" className="py-0 btn-delete" onClick={() => onDelete(res)}>
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </td>
                </tr>
            )
            i++
        }
    })
    const nameLabel = type === 1 ? language['program_title_3'] : language['program_title_4']
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className="px-2">#</th>
                    <th className="px-2">{language['global_program_name']}</th>
                    <th className="px-2">{language['global_tank_size']}</th>
                    <th className="px-2">{nameLabel}</th>
                    <th className="px-2">{language['global_price']} ({language['global_baht']})</th>
                    <th className="px-2">{language['program_title_5']} ({language['program_title_6']})</th>
                    <th className="px-2">{language['global_branch']}</th>
                    <th className="px-2">{language['global_tool']}</th>
                </tr>
            </thead>
            <tbody>
                {item}
            </tbody>
        </Table>
    )
}

export const TabProgram = (props) => {
    const { programWashingMachine, programClothesDryer, userData, updateProgramClothesDryer, updateProgramWashingMachine, getProgramWashingMachine, getProgramClothesDryer, branchData, permission, language } = props

    const [washingMachine, setWashingMachine] = useState([])
    const [clothesDryer, setClothesDryer]     = useState([])
    const [show, setShow]                     = useState({ isShow: false, data: {}, type: 1 })
    const [validated, setValidated]           = useState(false)
    const [showDelete, setShowDelete]         = useState({ isShow: false, data: {}, type: 1 })

    const [programSort1, setProgramSort1] = useState('')
    const [programSort2, setProgramSort2] = useState('')
    const [sizeList1, setSizeList1]       = useState([])
    const [sizeList2, setSizeList2]       = useState([])
    const [branch, setBranch]             = useState('')

    const refForm = createRef()

    useEffect(async () => {
        if (_.isFunction(programWashingMachine.then)) {
            const res = await programWashingMachine
            setSizeList1(Object.keys(_.groupBy(res, (e)=> {return e.size;})))
            setWashingMachine(_.sortBy(res, ['size', 'name']))
        }
        if (_.isFunction(programClothesDryer.then)) {
            const res = await programClothesDryer
            setSizeList2(Object.keys(_.groupBy(res, (e)=> {return e.size;})))
            setClothesDryer(_.sortBy(res, ['size', 'name']))
        }
    }, [programWashingMachine, programClothesDryer])

    const handleClose = () => {
        setShow({ isShow: false, data: {}, type: 1 })
        setShowDelete({ isShow: false, data: {}, type: 1 })
        setValidated(false)
    }

    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                const param = {
                    name            : form['name'].value,
                    size            : form['size'].value,
                    price           : Number(form['price'].value),
                    time            : Number(form['time'].value),
                    modifyAt        : moment().unix(),
                    modifyBy        : userData.id,
                    waterTemperature: form['waterTemperature'].value,
                    branch          : form['branch'].value
                }
                if (show.type === 1) {
                    await updateProgramWashingMachine(show.data.docId, param)
                    await getProgramWashingMachine()
                    handleClose()
                } else if (show.type === 2) {
                    await updateProgramClothesDryer(show.data.docId, param)
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
    }
    const handleDeleteSubmit = async () => {
        try {
            const param = {
                modifyAt: moment().unix(),
                modifyBy: userData.id,
                status: 99
            }
            if (showDelete.type === 1) {
                await updateProgramWashingMachine(showDelete.data.docId, param)
                await getProgramWashingMachine()
                handleClose()
            } else if (showDelete.type === 2) {
                await updateProgramClothesDryer(showDelete.data.docId, param)
                await getProgramClothesDryer()
                handleClose()
            }
        } catch (error) {
            console.log(`handleDeleteSubmit`, error)
        }
    }
    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Body>
                            <Tabs defaultActiveKey="washingMachine" className="mb-3">
                                <Tab eventKey="washingMachine" title={language['global_washing_machine']}>
                                    <Row>
                                        <Col md={2} className="mb-3">
                                            <Form.Select
                                                onChange={(e) => { setBranch(e.target.value) }}
                                                name={'branch'}
                                                value={branch}
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
                                        </Col>
                                        <Col md={2} className="mb-3">
                                            <Form.Select name="programSort" value={programSort1} onChange={(e) => setProgramSort1(e.target.value)}>
                                                <option value="">{language['program_title_7']}</option>
                                                {
                                                    sizeList1.map((res, index) => {
                                                        return <option key={res} value={res}>{res}</option>
                                                    })
                                                }
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Col className="tableNoWrap">
                                        <RenderItemTable data={washingMachine} language={language} type={1} programSort={programSort1} branchData={branchData} branch={branch} onEdit={(data) => setShow({
                                            isShow: true,
                                            data,
                                            type: 1
                                        })} onDelete={(data) => setShowDelete({
                                            isShow: true,
                                            data,
                                            type: 1
                                        })} />
                                    </Col>
                                </Tab>
                                <Tab eventKey="clothesDryer" title={language['global_dryer_machine']}>
                                    <Row>
                                        <Col md={2} className="mb-3">
                                            <Form.Select
                                                onChange={(e) => { setBranch(e.target.value) }}
                                                
                                                name={'branch'}
                                                value={branch}
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
                                        </Col>
                                        <Col md={2} className="mb-3">
                                            <Form.Select name="programSort" value={programSort2} onChange={(e) => setProgramSort2(e.target.value)}>
                                                <option value="">{language['program_title_7']}</option>
                                                {
                                                    sizeList2.map((res, index) => {
                                                        return <option key={res} value={res}>{res}</option>
                                                    })
                                                }

                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Col className="tableNoWrap">
                                        <RenderItemTable data={clothesDryer} language={language} type={2} programSort={programSort2} branchData={branchData} branch={branch} onEdit={(data) => setShow({
                                            isShow: true,
                                            data,
                                            type: 2
                                        })} onDelete={(data) => setShowDelete({
                                            isShow: true,
                                            data,
                                            type: 2
                                        })} />
                                    </Col>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showDelete.isShow} onHide={handleClose}>
                {
                    !_.isUndefined(showDelete.data.docId) &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{showDelete.type === 1 ? language['program_title_8'] : language['program_title_9']}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>{language['global_program_name']}: {showDelete.data.name}</h5>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            <i className="fas fa-window-close"></i> {language['global_cancel']}
                            </Button>
                            <Button variant="danger" onClick={handleDeleteSubmit}>
                            <i className="fas fa-trash-alt"></i> {language['global_delete']}
                            </Button>
                        </Modal.Footer>
                    </>
                }

            </Modal>

            <Modal show={show.isShow} onHide={handleClose}>
                {
                    !_.isUndefined(show.data.docId) &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{show.type === 1 ? language['program_title_10'] : language['program_title_11']}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form noValidate validated={validated} ref={refForm} >
                                <Form.Group as={Col}>
                                    <Form.Label>{language['program_title_1']}</Form.Label>
                                    <Form.Select
                                        name={'branch'}
                                        defaultValue={show.data.branch || ''}
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
                                            defaultValue={show.data.name}
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
                                            defaultValue={show.data.size}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>{show.type === 1 ? language['program_title_3'] : language['program_title_4']}</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="waterTemperature"
                                            placeholder={show.type === 1 ? `${language['program_title_3']} ...` : `${language['program_title_4']} ...`}
                                            defaultValue={show.data.waterTemperature}
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
                                            defaultValue={show.data.price}
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
                                            defaultValue={show.data.time}
                                            required
                                        />
                                        <InputGroup.Text>{language['program_title_6']}</InputGroup.Text>
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
                    </>
                }

            </Modal>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData, permission },
        program: {
            programWashingMachine,
            programClothesDryer
        },
        branch: { data: branchData },
        ui: { language }
    } = state
    return {
        programWashingMachine,
        programClothesDryer,
        userData,
        permission,
        branchData,
        language
    }
}

const mapDispatchToProps = {
    updateProgramClothesDryer: Program.updateProgramClothesDryer,
    updateProgramWashingMachine: Program.updateProgramWashingMachine,
    getProgramWashingMachine: Program.getProgramWashingMachine,
    getProgramClothesDryer: Program.getProgramClothesDryer
}

export default connect(mapStateToProps, mapDispatchToProps)(TabProgram)
