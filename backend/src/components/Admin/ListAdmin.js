import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form
} from 'react-bootstrap'
import moment from 'moment'
import Modal from '../Modal'
import { Auth, Firestore, Database } from '../../firebase'
import { AdminActions } from '../../redux/actions'
import { AddLogAdmin, reponseDatabase } from '../../utils/helpers'
import LogAdmin from './LogAdmin'
import _ from 'lodash'

export const ListAdmin = (props) => {
    const { adminData, getAdminAll, userData, branchData, permissionData, language } = props

    const [isActive, setIsActive] = useState({ dataAvtive: {}, listItem: [] })
    const [configModal, setConfigModal] = useState({
        title: '',
        errorMsg: '',
        pending: false
    })
    const [isShowLog, setIsShowLog] = useState({
        show: false,
        data: {}
    })
    const [branchCheck, setBranchCheck] = useState([])
    const [valSelect, setValSelect] = useState('');
    const onAdd = () => {
        const param = [
            {
                label: language['global_username'],
                name: 'name',
                required: true
            },
            {
                label: language['global_email'],
                name: 'email',
                type: 'email',
                required: true
            },
            {
                label: language['user_password'],
                name: 'password',
                type: 'password',
                required: true
            },
            {
                _type: true,
                name: '_type',
                value: 'add'
            }
        ]
        setConfigModal((oldData) => ({
            ...oldData,
            title: language['user_title_2']
        }))
        setIsActive({ dataAvtive: {}, listItem: param })
        setValSelect('')
        setBranchCheck([])
    }
    const onEdit = async (data) => {


        const param = [
            {
                label: language['global_username'],
                name: 'name',
                value: data.name,
                required: true
            },
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
                name: '_type',
                value: 'edit'
            },
            {

                _type: true,
                name: '_id',
                value: data.docId
            }
        ]
        if (data.type > 1) {
            const res = await Database.AdminPermissionGet(data.uid)
            setBranchCheck(res.val() || [])
        } else {
            setBranchCheck([])
        }
        setConfigModal((oldData) => ({
            ...oldData,
            title: language['user_title_1']
        }))
        setIsActive({ dataAvtive: data, listItem: param })
        setValSelect(data.type)
    }
    const handleSubmit = async (form) => {
        try {
            setConfigModal((oldData) => ({
                ...oldData,
                errorMsg: '',
                pending: true
            }))
            if (form['_type'].value === 'add') {
                const resEmail = await Firestore.AdminGetByChild('email', form['email'].value)
                let isEmail = false
                resEmail.forEach((doc) => {
                    setConfigModal((oldData) => ({
                        ...oldData,
                        errorMsg: 'This email is already in use.',
                        pending: false
                    }))
                    isEmail = true
                })
                if (!isEmail) {
                    // const response = await Auth.createUserWithEmailAndPassword(form['email'].value, form['password'].value)
                    const keyTest = Firestore.AdminGetKey()
         
                    await Firestore.Admin().add({
                        uid: keyTest.id,
                        email: form['email'].value,
                        status: 1,
                        token: '',
                        name: form['name'].value,
                        type: Number(form['typeUser'].value),
                        photo: '',
                        createAt: moment().unix(),
                        modifyAt: '',
                        modifyBy: '',
                        lastLogin: '',
                        password: form['password'].value
                    });
                    await Database.AdminPermissionSet(keyTest.id, branchCheck)
                    await getAdminAll()
                    AddLogAdmin(userData, 'User', `Add User : ${form['name'].value}`)
                    setConfigModal((oldData) => ({
                        ...oldData,
                        pending: false
                    }))
                    setIsActive([])
                }
            } else if (form['_type'].value === 'edit') {
                const param = {
                    name: form['name'].value,
                    type: Number(form['typeUser'].value),
                    status: Number(form['status'].value),
                    modifyAt: moment().unix(),
                    modifyBy: userData.id
                }
                await Firestore.AdminUpdate(form['_id'].value, param)
                await Database.AdminPermissionSet(isActive.dataAvtive.uid, branchCheck)
                await getAdminAll()
                AddLogAdmin(userData, 'User', `Edit User : ${param.name}`)
                setConfigModal((oldData) => ({
                    ...oldData,
                    pending: false
                }))
                setIsActive([])
            }
        } catch (error) {
            setConfigModal((oldData) => ({
                ...oldData,
                errorMsg: error.message,
                pending: false
            }))
            console.log(`error`, error)
        }
    }
    const onLog = (data) => {
        AddLogAdmin(userData, 'User', `Open Log User : ${data.name}`)
        setIsShowLog({
            show: true,
            data: data
        })
    }
    const checkProgram = (data) => {
        const findId = _.findIndex(branchCheck, e => e.docId === data.docId)
        let item = _.cloneDeepWith(branchCheck)

        if (findId >= 0) {
            delete item[findId]
            setBranchCheck(_.compact(item))
        } else {

            item.push({
                docId: data.docId,
                name: data.name,
                dateOpenQRPayment: data.dateOpenQRPayment,
                idBranch: data.idBranch
            })
            setBranchCheck(item)
        }

    }
    const renderItemPermission = () => {
        const option = [
            {
                name: 'Admin',
                value: 1
            },
            {
                name: 'Super User',
                value: 2
            },
            {
                name: 'User',
                value: 3
            }
        ]
        return (
            <>
                <Form.Group as={Col} className="pb-2">
                    <Form.Label>{language['user_user_rights']}</Form.Label>
                    <Form.Select
                        name={'typeUser'}
                        required={true}
                        value={valSelect}
                        onChange={(e) => setValSelect(e.target.value)}
                    // defaultValue={isActive.dataAvtive.type || ''}
                    >
                        {
                            option.map((resSelect, indexSelect) => (<option key={`op-${indexSelect}`} value={resSelect.value}>{resSelect.name}</option>))
                        }
                    </Form.Select>
                </Form.Group>
                {
                    (valSelect == 2 || valSelect == 3) &&
                    <>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['user_title_3']}</Form.Label>
                            {
                                _.map(branchCheck,(res, index) => {
                                    return (
                                        <Form.Check
                                            key={index}
                                            type="checkbox"
                                            name="branch"
                                            value={res.docId}
                                            label={`${index + 1}.) ${res.name}`}
                                            onChange={(e) => checkProgram(res)}
                                            checked
                                        />
                                    )
                                })
                            }
                        </Form.Group>
                        <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['user_title_4']}</Form.Label>
                            {
                                _.map(branchData, (res, index) => {
                                    const findItem = _.find(branchCheck, e => e.docId === res.docId || e.id === res.docId)
                                    if (!findItem) {
                                        return (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                name="branch"
                                                value={res.docId}
                                                label={`${index + 1}.) ${res.name}`}
                                                // defaultChecked={ck}
                                                onClick={(e) => checkProgram(res)}
                                            />
                                        )
                                    }
                                })
                            }
                        </Form.Group>
                    </>

                }
            </>
        )
    }

    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Header className="bg-transparent pt-3">
                            <Row>
                                <Col>
                                    <h4>{language['user_management']}</h4>
                                </Col>
                                <Col className="text-end">
                                    <Button onClick={() => onAdd()}><i className="fas fa-plus"></i> {language['user_title_2']}</Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className="tableNoWrap">
                            {
                                isShowLog.show ?
                                    <LogAdmin data={isShowLog.data} back={() => setIsShowLog({
                                        show: false,
                                        data: {}
                                    })} />
                                    :
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th >#</th>
                                                <th>{language['global_username']}</th>
                                                <th>{language['global_email']}</th>
                                                <th>{language['user_usage_rights']}</th>
                                                <th>{language['global_status']}</th>
                                                <th>{language['user_table_1']}</th>
                                                <th>{language['global_tool']}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                _.orderBy(adminData,'name','asc').map((res, index) => {
                                                    let nameType = ''
                                                    switch (res.type) {
                                                        case 1:
                                                            nameType = 'Admin'
                                                            break;
                                                        case 2:
                                                            nameType = 'Super User'
                                                            break;
                                                        case 3:
                                                            nameType = 'User'
                                                            break;
                                                        default:
                                                            break;
                                                    }
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
                                                            <td className="px-2"><Button variant="link" className="p-0" onClick={() => onLog(res)}>{res.name}</Button></td>
                                                            <td className="px-2">{res.email}</td>
                                                            <td className="px-2">{nameType}</td>
                                                            <td className="px-2">{statusName}</td>
                                                            <td className="px-2">{res.password ? <span className="text-warning">{language['global_waiting_confirmed']}</span> : language['global_confirmed']}</td>
                                                            <td className="px-2">
                                                                <Button variant="link" className="p-0 btn-edit" onClick={() => onEdit(res)}>
                                                                    <i className="fas fa-edit"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal item={isActive.listItem} configModal={configModal} renderItem={renderItemPermission} submit={(e) => handleSubmit(e)} />

        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        admin: { data: adminData },
        user: {
            data: userData,
            permission: permissionData
        },
        branch: { data: branchData },
        ui: {language }
    } = state
    return {
        adminData,
        userData,
        branchData,
        permissionData,
        language
    }
}

const mapDispatchToProps = {
    getAdminAll: AdminActions.getAdminAll
}

export default connect(mapStateToProps, mapDispatchToProps)(ListAdmin)
