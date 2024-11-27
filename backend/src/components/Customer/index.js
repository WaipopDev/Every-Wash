import React, { useEffect, useState, createRef } from 'react'
import { connect } from 'react-redux'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form,
    InputGroup,
    FormControl
} from 'react-bootstrap'
import moment from 'moment'
import Modal from '../Modal'
import { Database,DatabaseRef } from '../../firebase'
import { AdminActions, Ui } from '../../redux/actions'
import { AddLogAdmin } from '../../utils/helpers'
import LogCustomer from './LogCustomer'
import ProfileCustomer from './ProfileCustomer'
import _ from 'lodash'

const PAGE_SIZE = 100;

export const index = (props) => {
    const { userData, customer, getCustomerAll, getCustomerFilter, alertShow, language } = props

    const [isActive, setIsActive] = useState([])
    const [configModal, setConfigModal] = useState({
        title: '',
        errorMsg: '',
        pending: false
    })
    const [isShowLog, setIsShowLog] = useState({
        show: false,
        data: {}
    })
    const [isShowProfile, setIsShowProfile] = useState({
        show: false,
        data: {}
    })

    const [type, setType]           = useState(0)
    const [gender, setGender]       = useState(0)
    const [firstName, setFirstName] = useState('')
    const [phone, setPhone]         = useState('')
    const [items, setItems]         = useState([]);
    const [lastKey, setLastKey]     = useState(null);

    const fromRefName = createRef()
    const fromRefPhone = createRef()

    useEffect(() => {
        // const ref = firebase.database().ref("items").orderByKey().limitToFirst(PAGE_SIZE);
        // ref.on("value", (snapshot) => {
        //   const data = snapshot.val();
        //   if (data) {
        //     const firstKey = Object.keys(data)[0];
        //     setItems(Object.values(data));
        //     setLastKey(firstKey);
        //   }
        // });
        // getDataUser()
        return () => {
        //   ref.off();
        };
      }, []);
    useEffect(async () => {
        getCustomerFilter(type, gender, firstName)
        // getDataUserFilter(type, gender, firstName, phone)
    }, [type, gender, firstName, phone])

    const getDataUserFilter = async (type, gender, firstName) => {
        const resCustome =  await Database.CustomerGetLimltFilter(PAGE_SIZE, type, gender, firstName, phone)
        if(resCustome.val()){
              const data = resCustome.val();
              const keys = Object.keys(data);
              let firstKey = Object.keys(data)[PAGE_SIZE - 1];
              if((PAGE_SIZE) !== keys.length){
                firstKey = null
              }
              setItems(Object.values(data));
              setLastKey(firstKey);
        }else{
            setItems([]);
            setLastKey(null);  
        }
    }

    const getDataUser = async () => {
     const resCustome =  await Database.CustomerGetLimlt(PAGE_SIZE)
     if(resCustome.val()){
        const data = resCustome.val();
        const keys = Object.keys(data);
        let firstKey = Object.keys(data)[PAGE_SIZE - 1];
        if((PAGE_SIZE) !== keys.length){
            firstKey = null
        }
        setItems(Object.values(data));
        setLastKey(firstKey);
     }
    }
    const handleLoadMore = async () => {
        if(lastKey){
            const resCustome =  await Database.CustomerGetLimltLoadMore(lastKey,PAGE_SIZE)
            if(resCustome.val()){
                const data = resCustome.val();
                const keys = Object.keys(data);
                const lastIndex = keys.length - 1;
                const newItems = Object.values(data).splice(1)
                let lastKey = keys[lastIndex];
                if((PAGE_SIZE + 1) !== keys.length){
                    lastKey = null
                }
                setItems((prevItems) => [...prevItems, ...newItems]);
                setLastKey(lastKey);
                
            }
        }
    }

    const onEdit = (data) => {
        const param = [
            {
                label: language['global_status'],
                name: 'status',
                type: 'select',
                value: data.status,
                option: [
                    {
                        name: language['global_active'],
                        value: 1
                    },
                    {
                        name: language['global_block'],
                        value: 2
                    },
                    {
                        name: language['global_delete'],
                        value: 99
                    }
                ]
            },
            {

                _type: true,
                name: '_id',
                value: data.uid
            },
            {

                _type: true,
                name: 'type',
                value: '_user'
            }
        ]
        setConfigModal((oldData) => ({
            ...oldData,
            title: `${language['customer_title_1']} : <${data.firstName}>`,
            data
        }))
        setIsActive(param)
    }
    const handleSubmit = async (form) => {
        try {
            setConfigModal((oldData) => ({
                ...oldData,
                errorMsg: '',
                pending: true
            }))
            if(form['type'].value === '_point'){
              const user = configModal.data
                const param = {
                    keyUser     : user.uid,
                    firstName   : user.firstName,
                    lastName    : user.lastName,
                    activity    : 9,
                    phoneNumber : user.phoneNumber,
                    point       : Number(form['point'].value),
                    status      : 1,
                    activityType: Number(form['status'].value),   // 1 ได้ 2 ตัด
                    adminBy     : userData.id,
                    adminName   : userData.name,
                    defaultPoint: user.point || 0,
                    remarks     : form['remarks'].value,
                    level       : user.level
                }
    
                await Database.WalletSetPointAdmin(param)
                await getCustomerAll()
                AddLogAdmin(userData, 'Customer', `Edit Point Customer : ${user.firstName} `)
            }else if(form['type'].value === '_wallet'){
                const user = configModal.data
                const ref1 = `${user.uid}`
                const ref2 = `T${moment().unix()}`
                const param = {
                    keyUser      : user.uid,
                    firstName    : user.firstName,
                    lastName     : user.lastName,
                    channel      : 1,
                    activity     : Number(form['status'].value),
                    refWallet    : `${ref2}${ref1}`,
                    amount       : Number(form['wallet'].value),
                    status       : 1,
                    ref1         : ref1,
                    ref2         : ref2,
                    branchId     : '',
                    programId    : '',
                    refDefault   : `${ref1}_${ref2}`,
                    phoneNumber  : user.phoneNumber,
                    defaultAmount: user.amount || 0,
                    defaultPoint : user.point || 0,
                    adminBy      : userData.id,
                    adminName    : userData.name,
                    remarks      : form['remarks'].value,
                }
                await Database.WalletSetByAdmin(param)
                await getCustomerAll()
                AddLogAdmin(userData, 'Customer', `Edit Wallet Customer : ${user.firstName} `)
            }else if(form['type'].value === '_user'){
                const user = configModal.data
                const param = {
                    status: Number(form['status'].value),
                    modifyAt: moment().unix(),
                    modifyBy: userData.id
                }
    
                await Database.CustomerUpdateByID(form['_id'].value, param)
                await getCustomerAll()
                AddLogAdmin(userData, 'Customer', `Edit Status Customer : ${user.firstName}`)
            }
            setConfigModal((oldData) => ({
                ...oldData,
                pending: false
            }))
            setIsActive([])
        } catch (error) {
            console.log(`error`, error)
        }
    }
    const onLog = (data) => {
        AddLogAdmin(userData, 'Customer', `Open Log Customer : ${data.firstName}`)
        setIsShowProfile({
            show: false,
            data: {}
        })
        setIsShowLog({
            show: true,
            data: data
        })
    }
    const onProfile = (data) => {
        AddLogAdmin(userData, 'Customer', `Open Profile Customer : ${data.firstName}`)
        setIsShowProfile({
            show: true,
            data: data
        })
        setIsShowLog({
            show: false,
            data: {}
        })
    }

    const onSetPoint = (data) =>{
        const param = [
            {
                label: language['customer_title_3'],
                name: 'status',
                type: 'select',
                value: data.status,
                option: [
                    {
                        name: language['global_add'],
                        value: 1
                    },
                    {
                        name: language['global_delete'],
                        value: 2
                    }
                ]
            },
            {
                label: language['global_point'],
                name: 'point',
                type: 'number',
                value: '',
                required:true
            },
            {
                label: language['global_remark'],
                name: 'remarks',
                value: '',
                required:true
            },
            {

                _type: true,
                name: '_id',
                value: data.uid
            },
            {

                _type: true,
                name: 'type',
                value: '_point'
            }
        ]
        setConfigModal((oldData) => ({
            ...oldData,
            title: `${language['customer_title_4']} : <${data.firstName}>`,
            data
        }))
        setIsActive(param)
    }
    const onSetWallet = (data) =>{
        const param = [
            {
                label: language['customer_title_5'],
                name: 'status',
                type: 'select',
                value: data.status,
                option: [
                    {
                        name: 'Add',
                        value: 1
                    },
                    {
                        name: 'Delete',
                        value: 2
                    }
                ]
            },
            {
                label: language['customer_title_6'],
                name: 'wallet',
                type: 'number',
                value: '',
                required:true
            },
            {
                label: language['global_remark'],
                name: 'remarks',
                value: '',
                required:true
            },
            {

                _type: true,
                name: '_id',
                value: data.uid
            },
            {

                _type: true,
                name: 'type',
                value: '_wallet'
            }
        ]
        setConfigModal((oldData) => ({
            ...oldData,
            title: `${language['customer_title_7']} : <${data.firstName}>`,
            data
        }))
        setIsActive(param)
    }
    const checkPoint = async (res) => {
        const snapshot = await Database.CustomerGetByKey(res.uid)
        const snapshotLevel = await Database.GetDataLevel()
        if (snapshot.val() && snapshotLevel.val()) {
            const data = snapshot.val()
            const dataLevel = snapshotLevel.val()
            const ref1 = `${data.uid}`
            const ref2 = `T${moment().unix()}`
            const param = {
                keyUser      : data.uid,
                firstName    : data.firstName,
                lastName     : data.lastName,
                channel      : 1,
                activity     : 1,
                refWallet    : `${ref2}${ref1}`,
                amount       : dataLevel.walletDefault,
                status       : 1,
                ref1         : ref1,
                ref2         : ref2,
                branchId     : '',
                programId    : '',
                refDefault   : `${ref1}_${ref2}`,
                phoneNumber  : data.phoneNumber,
                defaultAmount: data.amount || 0,
                defaultPoint : data.point || 0,
                adminBy      : 'System',
                adminName    : 'System',
                remarks      : 'Point to wallet',
            }
            const usePoint = data.usePoint || 0
            const point = (data.point || 0) - usePoint

            const param2 = {
               usePoint: usePoint + dataLevel.pointToWallet
            }
            if(point >= dataLevel.pointToWallet){
                await Database.CustomerUpdateByID(data.uid,param2)
                await Database.WalletSetByAdmin(param)
                await getCustomerAll()
            }
            alertShow(language['global_transaction_successfully'])
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
                                    <h4>{language['customer_management']}</h4>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            {
                                !isShowProfile.show ?
                            <Row className="justify-content-end">
                                <Col className="py-2 text-end" md={3} xl={2}>
                                    <Form.Select
                                        onChange={ (e) => { setType(e.target.value) }}
                                        name={'type'}
                                    >
                                        <option value={''}>{language['customer_select_1']}</option>
                                        <option value={1}>{language['global_active']}</option>
                                        <option value={2}>{language['global_block']}</option>
                                    </Form.Select>
                                </Col>
                                <Col className="py-2 text-end" md={3} xl={2}>
                                    <Form.Select
                                        onChange={ (e) => { setGender(e.target.value) }}
                                        name={'gender'}
                                    >
                                        <option value={''}>{language['customer_select_2']}</option>
                                        <option value={1}>{language['global_man']}</option>
                                        <option value={2}>{language['global_female']}</option>
                                    </Form.Select>
                                </Col>
                                <Col className="py-2 text-end" md={4} xl={3}>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder={language['global_username']}
                                            name={'name'}
                                            ref={fromRefName}
                                        />
                                        {/* <FormControl
                                            placeholder="เบอร์โทร"
                                            name={'phone'}
                                            ref={fromRefPhone}
                                        /> */}
                                        <Button  
                                            onClick={ () => {setFirstName(fromRefName.current.value) }}
                                        >
                                            <i className="fas fa-search"></i> {language['global_search']}
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            : null}
                            {
                            isShowLog.show &&
                                    <LogCustomer data={isShowLog.data} back={() => setIsShowLog({
                                        show: false,
                                        data: {}
                                    })} />
                            }
                            {
                            isShowProfile.show &&
                                <ProfileCustomer data={isShowProfile.data} back={() => setIsShowProfile({
                                    show: false,
                                    data: {}
                                })} />
                            }
                            {
                                !isShowProfile.show && !isShowLog.show && 
                                <Col className="tableNoWrap">
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{language['global_username']}</th>
                                                <th>{language['customer_table_1']}</th>
                                                <th>{language['customer_table_2']}</th>
                                                <th>{language['customer_table_3']}</th>
                                                <th>{language['global_point']}</th>
                                                <th>{language['global_member_card']}</th>
                                                <th>{language['global_status']}</th>
                                                <th>{language['global_tool']}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                _.orderBy(customer,'firstName','asc').map((res, index) => {
                                                    // _.map(items,(res, index) => {
                                                    let statusName = ''
                                                    switch (res.status) {
                                                        case 1:
                                                            statusName = <span className="text-success">{language['global_active']}</span>
                                                            break;
                                                        case 2:
                                                            statusName = <span className="text-warning">{language['global_block']}</span>
                                                            break;
                                                        case 99:
                                                            statusName = <span className="text-danger">{language['global_delete']}</span>
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-2">{index + 1}</td>
                                                            <td className="px-2"><Button variant="link" className="p-0" onClick={() => onProfile(res)}>{res.firstName}</Button></td>
                                                            <td className="px-2">{res.phoneNumber}</td>
                                                            <td className="px-2">{res.gender === 1 ? language['global_man'] : language['global_female']}</td>
                                                            <td className="px-2">
                                                                <div style={{justifyContent:'space-between',display:'flex'}}>
                                                                <span>{res.usePoint || ''}</span>
                                                                {
                                                                    <Button variant="link" className="p-0" onClick={() => checkPoint(res)}>
                                                                        <i className="fas fa-sync-alt"></i>
                                                                    </Button>
                                                                }
                                                                </div>
                                                            </td>
                                                            <td className="px-2">
                                                                <div style={{justifyContent:'space-between',display:'flex'}}>
                                                                <span>{res.point || ''}</span>
                                                                {
                                                                    <Button variant="link" className="p-0 btn-edit" onClick={() => onSetPoint(res)}>
                                                                        <i className="fas fa-edit"></i>
                                                                    </Button>
                                                                }
                                                                </div>
                                                            </td>
                                                            <td className="px-2">
                                                                <div style={{justifyContent:'space-between',display:'flex'}}>
                                                                <span>{res.amount || ''}</span>
                                                                {
                                                                    <Button variant="link" className="p-0 btn-edit" onClick={() => onSetWallet(res)}>
                                                                        <i className="fas fa-edit"></i>
                                                                    </Button>
                                                                }
                                                                </div>
                                                            </td>
                                                            <td className="px-2">{statusName}</td>
                                                            <td className="px-2">
                                                                <Button variant="link" className="py-0 btn-edit" onClick={() => onEdit(res)}>
                                                                    <i className="fas fa-edit"></i>
                                                                </Button>
                                                                <Button variant="link" className="py-0" onClick={() => onLog(res)}>
                                                                    <i className="fas fa-list-alt"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    {lastKey && <Col className="text-center">
                                            <Button onClick={() => handleLoadMore()} variant="secondary">{language['global_load_more']}</Button>
                                        </Col>}
                                    </Col>
                            }
                           
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal item={isActive} configModal={configModal} submit={(e) => handleSubmit(e)} />

        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        admin: {
            customer
        },
        user: {
            data: userData
        },
        ui: {language }
    } = state
    return {
        customer,
        userData,
        language
    }
}

const mapDispatchToProps = {
    getCustomerAll: AdminActions.getCustomerAll,
    getCustomerFilter: AdminActions.getCustomerFilter,
    alertShow : Ui.alertShow
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
