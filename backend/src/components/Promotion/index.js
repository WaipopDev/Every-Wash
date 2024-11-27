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
import ListPromotion from './ListPromotion'
import { Firestore, Database, Storage } from '../../firebase'
import { PromotionAction } from '../../redux/actions'
import { reponseDatabase, AddLogAdmin } from '../../utils/helpers';
import _ from 'lodash'

export const Promotion = (props) => {
    const { userData, promotionData, branchData, getPromotion, language } = props
    const [show, setShow] = useState({ isShow: false, type: 'add' });
    const [validated, setValidated] = useState(false);
    const [itemEdit, setItemEdit] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [handleChangeFile, setHandleChangeFile] = useState('');
    const [resSubmit, setResSubmit] = useState({
        errorMsg: '',
        pending: false
    })
    const [imageShow, setImageShow] = useState('');
    const refForm = createRef()
    useEffect(async () => {
        // const reference = await Storage.PromotionGet('123')
        // console.log(`img`, reference)
        // setImageShow(reference)
        //    reference.forEach(ref=>{
        //        console.log(`ref`, ref)
        //    })
    }, [])
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
                        detail: form['detail'].value,
                        startDate: moment(new Date(startDate)).unix(),
                        endDate: moment(new Date(endDate)).unix(),
                        createAt: moment().unix(),
                        createBy: userData.id,
                        modifyAt: '',
                        modifyBy: '',
                        status: 1,
                        branch: [],
                        imageUrl: ''
                    }
                    const uploadedFile = handleChangeFile.target.files[0]
                    const checkBranch = _.filter(form['branch'], e => e.checked)
                    if (checkBranch.length) {
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                    }
                    const newReference = Database.PromotionGetKey()
                    await Storage.Promotion().child(newReference.key).put(uploadedFile)
                    param.imageUrl = await Storage.PromotionGet(newReference.key)
                    newReference.set(param)
                    await getPromotion()
                    AddLogAdmin(userData, 'Promotion', `Add Promotion name : ${form['name'].value}`)
                    handleClose()
                } else if (form['_type'].value === 'edit') {
                    let param = {
                        name: form['name'].value,
                        detail: form['detail'].value,
                        startDate: moment(new Date(startDate)).unix(),
                        endDate: moment(new Date(endDate)).unix(),
                        modifyAt: moment().unix(),
                        modifyBy: userData.id,
                    }

                    if (handleChangeFile) {
                        const uploadedFile = handleChangeFile.target.files[0]
                        await Storage.Promotion().child(itemEdit.docId).put(uploadedFile)
                        param.imageUrl = await Storage.PromotionGet(itemEdit.docId)
                    }
                    const checkBranch = _.filter(form['branch'], e => e.checked)
                    if (checkBranch.length) {
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                    }
                    await Database.PromotionUpdateByKey(itemEdit.docId, param)
                    await getPromotion()
                    AddLogAdmin(userData, 'Promotion', `Edit Promotion name : ${form['name'].value}`)
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
        setItemEdit(e)
        setStartDate(new Date(e.startDate * 1000))
        setEndDate(new Date(e.endDate * 1000))
        setShow({ isShow: true, type: 'edit', value: e.docId })

    }
    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
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
                                        <h4>{language['promotion_management']}</h4>
                                    </Col>
                                    <Col className="text-end">
                                        <Button onClick={() => setShow({ isShow: true, type: 'add' })}><i className="fas fa-plus"></i> {language['promotion_add']}</Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body  className="tableNoWrap">
                           
                                <ListPromotion onEdit={(e) => onEdit(e)} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={show.isShow} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{show.type === 'add' ? language['promotion_add'] : language['promotion_edit']}</Modal.Title>
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
                                <Form.Label>{language['promotion_title_1']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder={`${language['promotion_title_1']} ...`}
                                    defaultValue={itemEdit.name}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_2']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="detail"
                                    placeholder={`${language['promotion_title_2']} ...`}
                                    defaultValue={itemEdit.detail}
                                    as="textarea" rows={3}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_3']}</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_4']}</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_5']}</Form.Label>
                                <Form.Control
                                    type="file"
                                    required={show.type === 'edit' ? false : true}
                                    name="image"
                                    accept=".png, .jpg, .jpeg"
                                    defaultValue={itemEdit.image}
                                    onChange={(e) => setHandleChangeFile(e)}
                                // isInvalid={!!errors.file}
                                />
                            </Form.Group>
                            {
                                show.type === 'edit' &&
                                <Form.Group as={Col} className="pb-2">
                                    <Image alt={itemEdit.name} className="navbar-brand-img" src={itemEdit.imageUrl} width={120} height={150} />
                                </Form.Group>
                            }
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_6']}</Form.Label>
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
                        <i className="fas fa-window-close"></i> {language['global_close']}
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit()}>
                            {resSubmit.pending ? <Spinner animation="border" variant="light" /> : <> <i className="fas fa-save"></i> {language['global_save']}</>}
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
        promotion: {
            data: promotionData
        },
        branch: { data: branchData },
        ui: {language }
    } = state
    return {
        userData,
        promotionData,
        branchData,
        language
    }
}

const mapDispatchToProps = {
    getPromotion: PromotionAction.getPromotion
}

export default connect(mapStateToProps, mapDispatchToProps)(Promotion)
