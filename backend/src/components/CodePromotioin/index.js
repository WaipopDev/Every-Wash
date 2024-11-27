import React, { useState, useEffect, forwardRef, createRef } from 'react'
import Link from "next/link";
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    Form,
    Modal,
    Spinner,
    Alert,
    InputGroup,
    FormControl
} from 'react-bootstrap'
import moment from 'moment'

import DatePicker from "react-datepicker";
import { Database,Firestore } from '../../firebase'
import { PointRedemtionAction } from '../../redux/actions'
import { reverseObject,numberWithSeparators, AddLogAdmin } from '../../utils/helpers'
import _ from 'lodash';

export const CodePromotioin = (props) => {
    const { branchData, userData, language } = props

    const [show, setShow]           = useState({ isShow: false, type: 'add' });
    const [validated, setValidated] = useState(false);
    const [itemEdit, setItemEdit]   = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate]     = useState(new Date());
    const [itemData, setItemData]   = useState([]);
    const [resSubmit, setResSubmit] = useState({
        errorMsg: '',
        pending: false
    })
    
    const refForm = createRef()
  
    useEffect(()=>{
        getData()
    },[])
    const getData = async () =>{
        try {
            const res = await Firestore.CodePromotionGet()
            let item = []
            res.forEach(element => {
                item.push({ ...element.data(), ...{ docId: element.id } })
            });
            setItemData(item)
        } catch (error) {
            console.log('error', error)
        }
    }

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const renderTbody = () => {
        let item = []
        itemData.map((res, index) => {
            let status = res.status == '1' ? <span className="text-success">{language['global_active']}</span> : <span className="text-danger">{language['global_inactive']}</span>
            if(moment().unix() >= res.endDate){
                status = <span className="text-danger">{'หมดอายุ'}</span>
            }
            item.push(
                <tr key={index}>
                    <td className="px-2">{moment.unix(res.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td className="px-2">{moment.unix(res.startDate).format('DD-MM-YYYY')}</td>
                    <td className="px-2">{moment.unix(res.endDate).format('DD-MM-YYYY')}</td>
                    <td className="px-2">{res.code}</td>
                    <td className="px-2">{res.baht}</td>
                    <td className="px-2">{res.limitCode}</td>
                    <td className="px-2">
                        {
                            _.map(res.branch, (resBranch, indexBranch) => {
                                return (
                                    <p key={`i-${indexBranch}`}>{`${indexBranch + 1}.) ${resBranch.name}`}</p>
                                )
                            })
                        }
                    </td>
                   
                    <td className="px-2">{status}</td>
                    <td className="px-2">
                            <Button variant="link" className="p-0 btn-edit" onClick={() => onEdit(res)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                    </td>
                </tr>
            )
        })
        return item
    }

    const handleClose = () => {
        setStartDate(new Date())
        setEndDate(new Date())
        setResSubmit({
            errorMsg: '',
            pending: false
        })
        setItemEdit({})
        setValidated(false)
        setShow({ isShow: false, type: 'add' })
    }
    const onEdit = (e) => {
        setValidated(false);
        setStartDate(new Date(e.startDate * 1000))
        setEndDate(new Date(e.endDate * 1000))
        setItemEdit(e)
        setShow({ isShow: true, type: 'edit', value: e.docId })

    }
    const handleSubmit = async () =>{
        try {
            setResSubmit({
                errorMsg: '',
                pending: true
            })
            const form = refForm.current
            if (form.checkValidity() === true) {
                const checkBranch = _.filter(form['branch'], e => e.checked)
                if (checkBranch.length){
                    if (form['_type'].value === 'add') {
                        let param = {
                            code     : form['code'].value,
                            baht     : form['baht'].value,
                            limitCode: form['limitCode'].value,
                            startDate: moment(new Date(startDate)).unix(),
                            endDate  : moment(new Date(endDate)).unix(),
                            createAt : moment().unix(),
                            createBy : userData.id,
                            modifyAt : '',
                            modifyBy : '',
                            status   : form['status'].value,
                            branch   : []
                        }
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                        await Firestore.SetCodePromotion(param)
                        AddLogAdmin(userData, 'SetCodePromotion', `Add Code name : ${form['code'].value}`)
                        getData()
                        handleClose()
                    }else if (form['_type'].value === 'edit'){
                        let param = {
                            code     : form['code'].value,
                            baht     : form['baht'].value,
                            limitCode: form['limitCode'].value,
                            startDate: moment(new Date(startDate)).unix(),
                            endDate  : moment(new Date(endDate)).unix(),
                            modifyAt : moment().unix(),
                            modifyBy : userData.id,
                            status   : form['status'].value,
                            branch   : []
                        }
                        param.branch = _.map(checkBranch, (res) => ({ key: res.value, name: _.find(branchData, e => e.docId === res.value).name }))
                        await Firestore.UpdateCodePromotion(itemEdit.docId, param)
                        AddLogAdmin(userData, 'EditCodePromotion', `Edit Code name : ${form['code'].value}`)
                        getData()
                        handleClose()
                    }
                    return
                }else{
                    setResSubmit({
                        errorMsg: language['log_table_7'],
                        pending: false
                    })
                }
            }else{
                setResSubmit({
                    errorMsg: '',
                    pending: false
                })
            }
            
            setValidated(true);
        } catch (error) {
            console.log(`error`, error)
        }
    }

    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Header className="bg-transparent pt-3">
                            <Row>
                                <Col>
                                    <h4>{language['code_promotion_management']}</h4>
                                </Col>
                                <Col className="text-end">
                                    <Button onClick={() => setShow({ isShow: true, type: 'add' })}><i className="fas fa-plus"></i> {language['code_promotion_add']}</Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                           
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="px-2">{language['report_table_1']}</th>
                                        <th className="px-2">{language['global_start_date']}</th>
                                        <th className="px-2">{language['global_end_date']}</th>
                                        <th className="px-2">{language['global_code']}</th>
                                        <th className="px-2">{language['code_promotion_title_1']} ({language['global_baht']})</th>
                                        <th className="px-2">{language['code_promotion_title_2']}</th>
                                        <th className="px-2">{language['global_branch']}</th>
                                        <th className="px-2">{language['global_status']}</th>
                                        <th className="px-2">{language['global_tool']}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTbody()}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={show.isShow} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{show.type === 'add' ? language['code_promotion_add'] : language['code_promotion_edit']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Form noValidate validated={validated} ref={refForm} >
                            <Form.Control
                                type="hidden"
                                name="_type"
                                value={show.type}
                            />
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_code']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="code"
                                    placeholder={`${language['global_code']} ...`}
                                    defaultValue={itemEdit.code}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['code_promotion_title_2']}</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="limitCode"
                                    placeholder={`${language['code_promotion_title_2']} ...`}
                                    defaultValue={itemEdit.limitCode}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['code_promotion_title_1']} ({language['global_baht']})</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="baht"
                                    placeholder={`${language['code_promotion_title_1']} (${language['global_baht']}) ...`}
                                    defaultValue={itemEdit.baht}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_status']}</Form.Label>
                                <Form.Select name="status" defaultValue={!_.isUndefined(itemEdit.status) ? itemEdit.status : '1'} required>
                                    <option value="1">{language['global_active']}</option>
                                    <option value="2">{language['global_inactive']}</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_start_date']}</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_end_date']}</Form.Label>
                                <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['promotion_title_6']}</Form.Label>
                                {
                                    resSubmit.errorMsg &&
                                    <Alert variant={'danger'}>
                                        {resSubmit.errorMsg}
                                    </Alert>
                                }
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
                            {resSubmit.pending ? <Spinner animation="border" variant="light" /> : <><i className="fas fa-save"></i> {language['global_save']}</>}
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData },
        branch: { data: branchData },
        ui: {language }
    } = state
    return {
        branchData,
        userData,
        language
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CodePromotioin)
