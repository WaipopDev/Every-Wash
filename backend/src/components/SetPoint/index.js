import React, { useEffect, useState, createRef, forwardRef } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";
import moment from 'moment'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form,
    Alert,
    Spinner,
    Tab,
    Table
} from 'react-bootstrap'

import DatePicker from "react-datepicker";
import ListSetPoint from './ListSetPoint'
import { Firestore, Database, Storage } from '../../firebase'
import { SetPointAction } from '../../redux/actions'
import { reponseDatabase, AddLogAdmin } from '../../utils/helpers';
import _ from 'lodash'

export const SetPoint = (props) => {
    const { userData, branchData, pointData, getSetPointGetAll } = props
    const [show, setShow] = useState({ isShow: false, type: 'add' });
    const [validated, setValidated] = useState(false);
    const [itemEdit, setItemEdit] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [resSubmit, setResSubmit] = useState({
        errorMsg: '',
        pending: false
    })

    const refForm = createRef()
    
    const handleClose = () => {
        setShow({ isShow: false, type: 'add' })
        setStartDate(new Date())
        setEndDate(new Date())
        setResSubmit({
            errorMsg: '',
            pending: false
        })
        setValidated(false)
        // setItemEdit({})
    }

    const handleSubmit = async () => {
        try {

            setResSubmit({
                errorMsg: '',
                pending: true
            })
            const form = refForm.current
            if (form.checkValidity() === true) {
                if (form['_type'].value === 'add') {
                    let param = {
                        name: form['name'].value,
                        point: form['point'].value,
                        baht: form['baht'].value,
                        startDate: moment(new Date(startDate)).unix(),
                        endDate: moment(new Date(endDate)).unix(),
                        createAt: moment().unix(),
                        createBy: userData.id,
                        modifyAt: '',
                        modifyBy: '',
                        status: 1,
                        branch: []
                    }
                    const checkBranch = _.filter(form['branch'], e => e.checked)
                    if (checkBranch.length) {
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                    }
                    const newReference = Database.SetPointGetKey()
                    newReference.set(param)
                    await getSetPointGetAll()
                    AddLogAdmin(userData, 'SetPoint', `Add Point name : ${form['name'].value}`)
                    handleClose()
                } else if (form['_type'].value === 'edit') {
                    let param = {
                        name: form['name'].value,
                        point: form['point'].value,
                        baht: form['baht'].value,
                        startDate: moment(new Date(startDate)).unix(),
                        endDate: moment(new Date(endDate)).unix(),
                        modifyAt: moment().unix(),
                        modifyBy: userData.id,
                    }

                    const checkBranch = _.filter(form['branch'], e => e.checked)
                    if (checkBranch.length) {
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                    }
                    await Database.SetPointUpdateByKey(itemEdit.docId, param)
                    await getSetPointGetAll()
                    AddLogAdmin(userData, 'SetPoint', `Edit Point name : ${form['name'].value}`)
                    handleClose()
                }
            }
            setValidated(true);
        } catch (error) {
            console.log(`error`, error)
        }
    }
    const onEdit = (e) => {
        setValidated(false);
        setStartDate(new Date(e.startDate * 1000))
        setEndDate(new Date(e.endDate * 1000))
        setItemEdit(e)
        setShow({ isShow: true, type: 'edit', value: e.docId })

    }

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })

    return (
        <>
            <Container fluid>
                <Row className="py-md-4">
                    <Col>
                        <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                            <Card.Header className="bg-transparent pt-3">
                                <Row>
                                    <Col>
                                        <h4>Point Management </h4>
                                    </Col>
                                    <Col className="text-end">
                                        <Button onClick={() => setShow({ isShow: true, type: 'add' })}>Add Point</Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                {
                                    // imageShow &&
                                    // <Image alt={'logo'} className="navbar-brand-img" src={imageShow} width={100} height={100} />
                                }
                                <ListSetPoint onEdit={(e) => onEdit(e)} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={show.isShow} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{show.type === 'add' ? 'Add Point' : 'Edit Point'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            // resSubmit.errorMsg &&
                            // <Alert variant={'danger'}>
                            //     {resSubmit.errorMsg}
                            // </Alert>
                        }
                        <Form noValidate validated={validated} ref={refForm} >
                            <Form.Control
                                type="hidden"
                                name="_type"
                                value={show.type}
                            />
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>ชื่อ Point</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="ชื่อ Point ..."
                                    defaultValue={itemEdit.name}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>Point</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="point"
                                    placeholder="point ..."
                                    defaultValue={itemEdit.point}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>Baht</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="baht"
                                    placeholder="baht ..."
                                    defaultValue={itemEdit.baht}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>วันที่เริ่ม Point</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>วันที่สิ้นสุด Point</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>สาขาที่เข้าร่วม</Form.Label>
                                {
                                    _.map(branchData, (res, index) => {
                                        let ck = false
                                        if (show.type === 'edit') {
                                            if (_.find(itemEdit.branch, e => e.key === res.docId)) {
                                                ck = true
                                            }
                                        }
                                        return (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                name="branch"
                                                value={res.docId}
                                                label={`${index + 1}.) ${res.name}`}
                                                defaultChecked={ck}
                                            />
                                        )
                                    })
                                }
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit()}>
                            {resSubmit.pending ? <Spinner animation="border" variant="light" /> : "Save"}
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>

        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData },
        setPoint: {
            point: pointData
        },
        branch: { data: branchData }
    } = state
    return {
        userData,
        branchData,
        pointData
    }
}

const mapDispatchToProps = {
    getSetPointGetAll: SetPointAction.getSetPointAll
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPoint)
