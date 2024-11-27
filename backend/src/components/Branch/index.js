import React, { useState, useEffect, createRef, forwardRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import MapPage from '../MapPage';
import { Firestore, Database } from '../../firebase'
import { BranchActions } from '../../redux/actions'
import LietBranch from './LietBranch'
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
import DatePicker from "react-datepicker";
import _ from 'lodash'
import { reponseDatabase, AddLogAdmin, reponseFirestore } from '../../utils/helpers';

export const Branch = (props) => {
    const { userData, getBranch, branchData, language } = props

    const [show, setShow]                           = useState({ isShow: false, type: 'add' });
    const [showBank, setShowBank]                   = useState({isShow:false});
    const [showExpire, setShowExpire]               = useState({isShow:false});
    const [showPay, setShowPay]                     = useState({isShow:false});
    const [showBankSelect, setShowBankSelect]       = useState({ isShow: false });
    const [validated, setValidated]                 = useState(false);
    const [validatedBank, setValidatedBank]         = useState(false);
    const [dateOpenQRPayment, setdateOpenQRPayment] = useState(new Date());
    const [position, setPosition]                   = useState({ latitude: 13.763479, longitude: 100.5181292 });
    const [marker, setMarker]                       = useState({});
    const [itemEdit, setItemEdit]                   = useState({});
    const [itemEditBank, setItemEditBank]           = useState({});
    const [itemEditBankKbank, setItemEditBankKbank] = useState({});
    const [itemEditExpire, setItemEditExpire]       = useState({});
    const [itemEditPay, setItemEditPay]             = useState({});
    const [itemBankSelect, setItemBankSelect]       = useState({});
    const [dateExpire, setDateExpire]               = useState(new Date());
    const [datePay, setDatePay]                     = useState(new Date());
    const [statusClosePay, setStatusClosePay]       = useState(true);
    const [typeMember, setTypeMember]               = useState(1);
    const [bankSelect, setBankSelect]               = useState('SCB');
    const [formValues, setFormValues] = useState({
        resourceOwnerId: '',
        resourceSecretId: '',
        requestUId: '',
        ppId: '',
        CONSUMER_ID_KL: '',
        CONSUMER_SECRET_KL: '',
        PARTNER_ID_KL: '',
        MERCHANT_ID_KL: '',
        PARTNER_SECRET_KL: '',
        docId: ''
    });

    const refForm     = createRef()
    const refFormBank = createRef()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            setMarker({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        });
    }, [])

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {`${language['branch_title_1']} : `}<i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const CustomInputExpire = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {`${language['branch_title_2']} : `}<i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })

    const handleMarker = (e) => {
        setMarker({ latitude: e.lat, longitude: e.lng })
    }
    const handleClose = () => {
        setShow({ isShow: false, type: 'add' })
        setdateOpenQRPayment(new Date())
        setItemEdit({})
    }

    const handleSubmit = async () => {
        try {
            const form = refForm.current
            if (form['_type'].value === 'add') {
                if (form.checkValidity() === true) {
                   
                   
                   
                    // console.log('totalBranch.size', totalBranch.size + 1)
                    await Firestore.Branch().add({
                        status           : 1,
                        idBranch         : form['idBranch'].value,
                        dateOpenQRPayment: moment(new Date(dateOpenQRPayment)).unix(),
                        name             : form['name'].value,
                        nameCompany      : form['nameCompany'].value,
                        address          : form['address'].value,
                        tax              : form['tax'].value,
                        contactName      : form['contactName'].value,
                        contactEmail     : form['contactEmail'].value,
                        contactPhone     : form['contactPhone'].value,
                        billId           : form['billId'].value,
                        bankName         : form['bankName'].value,
                        bankNumber       : form['bankNumber'].value,
                        bank             : form['bank'].value,
                        bankBranch       : form['bankBranch'].value,
                        latitude         : form['latitude'].value,
                        longitude        : form['longitude'].value,
                        priceAll         : 0,
                        useAll           : 0,
                        createAt         : moment().unix(),
                        createBy         : userData.id,
                        modifyAt         : '',
                        modifyBy         : '',
                        resourceOwnerId  : '',
                        requestUId       : '',
                        resourceSecretId : '',
                        ppId             : '',
                        expire           : moment().add(1,'years').unix(),
                        typeMember       : typeMember,
                    })
                    const totalBranch = await Firestore.dataBaseFn().collection('Branch').get()
                    await Database.DashboardSetData('all',{totalBranch:(totalBranch.size),updateTime : moment().unix()})
                    _.map(reponseFirestore(totalBranch),async (item) => {
                        await Database.DashboardSetData(item.docId,{totalBranch:1,updateTime : moment().unix()})
                    })
                    // await Database.DashboardSetData(findBranch.docId, {updateTime : moment().unix()})  
                    await getBranch()
                    AddLogAdmin(userData, 'Branch', `Add Branch Name : ${form['name'].value}`)
                    handleClose()
                }
            } else if (form['_type'].value === 'edit') {
                if (form.checkValidity() === true) {
                    let param = {
                        idBranch         : form['idBranch'].value,
                        dateOpenQRPayment: moment(new Date(dateOpenQRPayment)).unix(),
                        name             : form['name'].value,
                        nameCompany      : form['nameCompany'].value,
                        address          : form['address'].value,
                        tax              : form['tax'].value,
                        contactName      : form['contactName'].value,
                        contactEmail     : form['contactEmail'].value,
                        contactPhone     : form['contactPhone'].value,
                        billId           : form['billId'].value,
                        bankName         : form['bankName'].value,
                        bankNumber       : form['bankNumber'].value,
                        bank             : form['bank'].value,
                        bankBranch       : form['bankBranch'].value,
                        latitude         : form['latitude'].value,
                        longitude        : form['longitude'].value,
                        modifyAt         : moment().unix(),
                        modifyBy         : userData.id,
                        typeMember       : typeMember,
                    }
                    await Firestore.BranchUpdate(itemEdit.docId, param)

                    const resMachine = await Database.WashingMachineGetByChild('branch', itemEdit.docId)
                    const snapshot = reponseDatabase(resMachine)
                 
                    snapshot.map(async (res) => {
                       const paramDB = {
                            branchName      : param.name,
                            branchLatitude  : param.latitude,
                            branchLongitude : param.longitude,
                        }  
                        await Database.WashingMachineUpdateByKey(res.docId, paramDB)
                    })
                    await getBranch()
                    AddLogAdmin(userData, 'Branch', `Edit Branch Name : ${form['name'].value}`)
                    handleClose()
                }
            }
            setValidated(true);
        } catch (error) {
            console.log(`error`, error)
        }
    }
    const handleSubmitBank = async () =>{
        try {
            const form = refFormBank.current
            if (form.checkValidity() === true) {
                const param = {
                    // resourceOwnerId: form['resourceOwnerId'].value,
                    // requestUId: form['requestUId'].value,
                    // resourceSecretId: form['resourceSecretId'].value,
                    // ppId:form['ppId'].value,
                    resourceOwnerId   : formValues.resourceOwnerId,
                    resourceSecretId  : formValues.resourceSecretId,
                    requestUId        : formValues.requestUId,
                    ppId              : formValues.ppId,
                    CONSUMER_ID_KL    : formValues.CONSUMER_ID_KL,
                    CONSUMER_SECRET_KL: formValues.CONSUMER_SECRET_KL,
                    PARTNER_ID_KL     : formValues.PARTNER_ID_KL,
                    MERCHANT_ID_KL    : formValues.MERCHANT_ID_KL,
                    PARTNER_SECRET_KL : formValues.PARTNER_SECRET_KL,
                    modifyAt          : moment().unix(),
                    modifyBy          : userData.id,
                }

                await Firestore.BranchUpdate(formValues.docId, param)
                const resMachine = await Database.WashingMachineGetByChild('branch', formValues.docId)
                const snapshot = reponseDatabase(resMachine)
                snapshot.map(async (res) => {
                    await Database.WashingMachineUpdateByKey(res.docId, param)
                })
                await getBranch()
                AddLogAdmin(userData, 'Branch', `Edit Branch Name : ${form['name'].value}`)
                handleCloseBank()
            }
            setValidatedBank(true);
        } catch (error) {
            setValidatedBank(false);
            handleCloseBank()
            console.log(`error`, error)
        }
    }
    const handleSubmitExpire = async () => {
        try {
            const param = {
                expire  : moment(new Date(dateExpire)).unix(),
                modifyAt: moment().unix(),
                modifyBy: userData.id,
            }
            
            await Firestore.BranchUpdate(itemEditExpire.docId, param)
            const resMachine = await Database.WashingMachineGetByChild('branch', itemEditExpire.docId)
            const snapshot = reponseDatabase(resMachine)
            snapshot.map(async (res) => {
                await Database.WashingMachineUpdateByKey(res.docId, param)
            })
            await getBranch()
            AddLogAdmin(userData, 'Branch', `Edit Branch Expire`)
            handleCloseExpire()
        } catch (error) {
            handleCloseExpire()
            console.log(`error`, error)
        }
    }
    const onEdit = (e) => {
        setItemEdit(e)
        setdateOpenQRPayment(new Date(moment(e?.dateOpenQRPayment * 1000 || new Date()).format('YYYY-MM-DD')))
        setTypeMember(e?.typeMember || '1')
        setMarker({ latitude: e.latitude, longitude: e.longitude })
        setShow({ isShow: true, type: 'edit', value: e.docId })
        setValidated(false);
    }
    const onEditBank = (e) => {
        // setItemEditBank(e)
        // setItemEditBankKbank(e)
        setFormValues({
            resourceOwnerId   : e.resourceOwnerId || '',
            resourceSecretId  : e.resourceSecretId || '',
            requestUId        : e.requestUId || '',
            ppId              : e.ppId || '',
            CONSUMER_ID_KL    : e.CONSUMER_ID_KL || '',
            CONSUMER_SECRET_KL: e.CONSUMER_SECRET_KL || '',
            PARTNER_ID_KL     : e.PARTNER_ID_KL || '',
            MERCHANT_ID_KL    : e.MERCHANT_ID_KL || '',
            PARTNER_SECRET_KL : e.PARTNER_SECRET_KL || '',
            docId             : e.docId || ''
        })
        setShowBank({ isShow: true, value: e })
    }
    const handleCloseBank = () =>{
        setShowBank({ isShow: false})
        // setItemEditBank({})
        // setItemEditBankKbank({})
        setFormValues({
            resourceOwnerId   : '',
            resourceSecretId  : '',
            requestUId        : '',
            ppId              : '',
            CONSUMER_ID_KL    : '',
            CONSUMER_SECRET_KL: '',
            PARTNER_ID_KL     : '',
            MERCHANT_ID_KL    : '',
            PARTNER_SECRET_KL : '',
            docId             : ''
        })
        setValidatedBank(false);
    }
    const onEditExpire = (e) => {
        setItemEditExpire(e)
        setShowExpire({ isShow: true, value: e })
        setDateExpire(new Date(moment(e?.expire * 1000 || new Date()).add(1,'years').format('YYYY-MM-DD')))
    }
    const handleCloseExpire = () =>{
        setShowExpire({ isShow: false})
        setItemEditExpire({})
        setDateExpire(new Date())
    }

    const onPay = (e) =>{
     
        setItemEditPay(e)
        setShowPay({ isShow: true, value: e })
        setDatePay(new Date(moment(e?.closePayDate * 1000 || new Date()).format('YYYY-MM-DD')))
        setStatusClosePay(`${e?.closePayDate ? e?.statusClosePay : true}`)
    }

    const handleClosePay = () =>{
        setShowPay({ isShow: false})
        setItemEditPay({})
        setDatePay(new Date())
        setStatusClosePay(true)
    }

    const onBankSelect = (e) =>{
        setItemBankSelect(e)
        setShowBankSelect({ isShow: true})
    }
    const handleCloseBankSelect = () =>{
        setShowBankSelect({ isShow: false})
        setItemBankSelect({})
        // setDatePay(new Date())
        // setStatusClosePay(true)
    }

    const handleSubmitBankSelect = async () => {
        try {
            const param = {
                bankType  : bankSelect,
                modifyAt      : moment().unix(),
                modifyBy      : userData.id,
            }
 
            await Firestore.BranchUpdate(itemBankSelect.docId, param)
            const resMachine = await Database.WashingMachineGetByChild('branch', itemBankSelect.docId)
            const snapshot = reponseDatabase(resMachine)
            snapshot.map(async (res) => {
                await Database.WashingMachineUpdateByKey(res.docId, param)
            })
            await getBranch()
            AddLogAdmin(userData, 'Branch', `Edit Branch Bank `)
            handleClosePay()
        } catch (error) {
            handleClosePay()
            console.log(`error`, error)
        }
    }

    const handleSubmitPay = async () => {
        try {
            const param = {
                closePayDate  : moment(new Date(datePay)).unix(),
                statusClosePay: statusClosePay === 'true' ? true : false,
                modifyAt      : moment().unix(),
                modifyBy      : userData.id,
            }
 
            await Firestore.BranchUpdate(itemEditPay.docId, param)
            const resMachine = await Database.WashingMachineGetByChild('branch', itemEditPay.docId)
            const snapshot = reponseDatabase(resMachine)
            snapshot.map(async (res) => {
                await Database.WashingMachineUpdateByKey(res.docId, param)
            })
            await getBranch()
            AddLogAdmin(userData, 'Branch', `Edit Branch Pay `)
            handleClosePay()
        } catch (error) {
            handleClosePay()
            console.log(`error`, error)
        }
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    return (
        <>
            <Container fluid>
                <Row className="py-md-4">
                    <Col>
                        <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                            <Card.Header className="bg-transparent pt-3">
                                <Row>
                                    <Col>
                                        <h4>{language['branch_management']}</h4>
                                    </Col>
                                    <Col className="text-end">
                                        <Button onClick={() => {setShow({ isShow: true, type: 'add' });setValidated(false);}}><i className="fas fa-plus"></i> {language['branch_add']}</Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="tableNoWrap">
                                <LietBranch onEdit={(e) => onEdit(e)} onEditBank={(e) => onEditBank(e)} onEditExpire={(e) => onEditExpire(e)} onPay={(e) => onPay(e)} onBankSelect={(e) => onBankSelect(e)}  />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showBankSelect.isShow} onHide={handleCloseBankSelect}>
                    <Modal.Header closeButton>
                        <Modal.Title>{language['branch_title_3']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form noValidate >
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['branch_select_1']}</Form.Label>
                                <Form.Select
                                    onChange={(e) => { setBankSelect(e.target.value) }}
                                    name={'setBankSelect'}
                                    value={bankSelect}
                                >
                                    <option value={'KBANK'}>{'KBANK'}</option>
                                    <option value={'SCB'}>{'SCB'}</option>
                                </Form.Select>
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseBankSelect}>
                            <i className="fas fa-window-close"></i> {language['global_cancel']}
                        </Button>
                        <Button variant="primary" onClick={handleSubmitBankSelect}>
                            <i className="fas fa-save"></i> {language['global_save']}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showPay.isShow} onHide={handleClosePay}>
                    <Modal.Header closeButton>
                        <Modal.Title>{language['branch_title_4']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form noValidate >
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_usage']}</Form.Label>
                                <Form.Select
                                    onChange={(e) => { setStatusClosePay(e.target.value) }}
                                    name={'statusClosePay'}
                                    value={statusClosePay}
                                >
                                    <option value={true}>{language['global_enabled']}</option>
                                    <option value={false}>{language['global_disabled']}</option>
                                </Form.Select>
                            </Form.Group>   
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['branch_title_5']}</Form.Label>
                                <DatePicker minDate={new Date()} customInput={<CustomInputExpire />} selected={datePay} onChange={(date) => setDatePay(date)} />
                            </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePay}>
                            <i className="fas fa-window-close"></i> {language['global_cancel']}
                        </Button>
                        <Button variant="primary" onClick={handleSubmitPay}>
                            <i className="fas fa-save"></i> {language['global_save']}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showExpire.isShow} onHide={handleCloseExpire}>
                    <Modal.Header closeButton>
                        <Modal.Title>{language['branch_title_6']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form noValidate >
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['branch_title_7']}</Form.Label>
                                <DatePicker maxDate={new Date(moment(showExpire.value?.expire * 1000 || new Date()).add(1,'years').format('YYYY-MM-DD'))} minDate={new Date()} customInput={<CustomInputExpire />} selected={dateExpire} onChange={(date) => setDateExpire(date)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseExpire}>
                        <i className="fas fa-window-close"></i> {language['global_cancel']}
                        </Button>
                        <Button variant="primary" onClick={handleSubmitExpire}>
                        <i className="fas fa-save"></i> {language['global_save']}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showBank.isShow} onHide={handleCloseBank}>
                    <Modal.Header closeButton>
                        <Modal.Title>{language['branch_title_8']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form noValidate validated={validatedBank} ref={refFormBank} >
                            <Form noValidate >
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_select_1']}</Form.Label>
                                        <Form.Select
                                            onChange={(e) => { setBankSelect(e.target.value) }}
                                            name={'setBankSelect'}
                                            value={bankSelect}
                                        >
                                            <option value={'KBANK'}>{'KBANK'}</option>
                                            <option value={'SCB'}>{'SCB'}</option>
                                        </Form.Select>
                                    </Form.Group>
                            </Form>
                            {bankSelect === 'SCB' ? (
                                <>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>Application Key</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="resourceOwnerId"
                                            placeholder="Application Key"
                                            value={formValues.resourceOwnerId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>Application Secret</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="resourceSecretId"
                                            placeholder="Application Secret"
                                            value={formValues.resourceSecretId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>Request UId</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="requestUId"
                                            placeholder="Request UId"
                                            value={formValues.requestUId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>ppId</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ppId"
                                            placeholder="ppId"
                                            value={formValues.ppId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>CONSUMER ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="CONSUMER_ID_KL"
                                            placeholder="CONSUMER ID"
                                            value={formValues.CONSUMER_ID_KL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>CONSUMER SECRET</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="CONSUMER_SECRET_KL"
                                            placeholder="CONSUMER SECRET"
                                            value={formValues.CONSUMER_SECRET_KL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>PARTNER ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="PARTNER_ID_KL"
                                            placeholder="PARTNER ID"
                                            value={formValues.PARTNER_ID_KL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>MERCHANT ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="MERCHANT_ID_KL"
                                            placeholder="MERCHANT ID"
                                            value={formValues.MERCHANT_ID_KL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>PARTNER SECRET</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="PARTNER_SECRET_KL"
                                            placeholder="PARTNER SECRET"
                                            value={formValues.PARTNER_SECRET_KL}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </>
                            )}
                            
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseBank}>
                        <i className="fas fa-window-close"></i> {language['global_cancel']}
                        </Button>
                        <Button variant="primary" onClick={handleSubmitBank}>
                        <i className="fas fa-save"></i> {language['global_save']}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show.isShow} onHide={handleClose} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{show.type === 'add' ? language['branch_add'] : language['branch_edit']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} ref={refForm} >
                            <Form.Control
                                type="hidden"
                                name="_type"
                                value={show.type}
                            />
                            <Row>
                                <Col>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_9']}</Form.Label>
                                        <DatePicker customInput={<CustomInput />} selected={dateOpenQRPayment} onChange={(date) => setdateOpenQRPayment(date)} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_10']}</Form.Label>
                                        <Form.Select
                                            onChange={(e) => { setTypeMember(e.target.value) }}
                                            name={'typeMember'}
                                            value={typeMember}
                                        >
                                            <option value={1}>{language['branch_free']}</option>
                                            <option value={2}>{language['branch_subscription']}</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_11']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`${language['branch_title_11']} ...`}
                                            defaultValue={itemEdit.createAt ? moment(itemEdit.createAt * 1000).format('DD-MM-YYYY') : '-'}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_7']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`${language['branch_title_7']} ...`}
                                            defaultValue={itemEdit.expire ? moment(itemEdit.expire * 1000).format('DD-MM-YYYY') : '-'}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_13']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="idBranch"
                                            placeholder={`${language['branch_title_13']} ...`}
                                            defaultValue={itemEdit.idBranch}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_14']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder={`${language['branch_title_14']} ...`}
                                            defaultValue={itemEdit.name}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_15']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nameCompany"
                                            placeholder={`${language['branch_title_15']} ...`}
                                            defaultValue={itemEdit.nameCompany}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_16']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder={`${language['branch_title_16']} ...`}
                                            defaultValue={itemEdit.address}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_17']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="tax"
                                            placeholder={`${language['branch_title_17']} ...`}
                                            defaultValue={itemEdit.tax}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_18']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contactName"
                                            placeholder={`${language['branch_title_18']} ...`}
                                            defaultValue={itemEdit.contactName}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['global_email']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contactEmail"
                                            placeholder={`${language['global_email']} ...`}
                                            defaultValue={itemEdit.contactEmail}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_19']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="contactPhone"
                                            placeholder={`${language['branch_title_19']} ...`}
                                            defaultValue={itemEdit.contactPhone}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_20']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="billId"
                                            placeholder={`${language['branch_title_20']} ...`}
                                            defaultValue={itemEdit.billId || '010552601807401'}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['global_account_name']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bankName"
                                            placeholder={`${language['global_account_name']} ...`}
                                            defaultValue={itemEdit.bankName}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_21']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bankNumber"
                                            placeholder={`${language['branch_title_21']} ...`}
                                            defaultValue={itemEdit.bankNumber}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_22']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bank"
                                            placeholder={`${language['branch_title_22']} ...`}
                                            defaultValue={itemEdit.bank}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_23']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bankBranch"
                                            placeholder={`${language['branch_title_23']} ...`}
                                            defaultValue={itemEdit.bankBranch}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_24']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="latitude"
                                            value={marker.latitude}
                                            onChange={(e) => setMarker(old => ({ ...old, latitude: e.target.value }))}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="pb-2">
                                        <Form.Label>{language['branch_title_25']}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="longitude"
                                            value={marker.longitude}
                                            onChange={(e) => setMarker(old => ({ ...old, longitude: e.target.value }))}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} style={{ height: 250 }}>
                                        <MapPage onClick={(e) => handleMarker(e)} marker={marker} position={position} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            
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

        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData },
        branch: { data: branchData },
        ui:{language}
    } = state
    return {
        userData,
        branchData,
        language
    }
}

const mapDispatchToProps = {
    getBranch: BranchActions.getBranch
}

export default connect(mapStateToProps, mapDispatchToProps)(Branch)
