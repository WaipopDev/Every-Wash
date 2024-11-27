import React, { useState, useEffect,createRef } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    Table,
    Row,
    Col,
    Form,
    Modal
} from 'react-bootstrap'
import LogMachine from './LogMachine'
import LogIOT from './LogIOT'
import { Database } from '../../firebase'
import { WashingMachineActions } from '../../redux/actions'
import { AddLogAdmin } from '../../utils/helpers'
import _ from 'lodash'

export const ListWashingMachine = (props) => {
    const refForm = createRef()

    const { washingMachineData, branchData, onEdit, getWashingMachineFilter, userData, permission, getWashingMachine, language } = props
    const [washingMachine, setWashingMachine] = useState([])
    const [branchFilter, setBranchFilter] = useState('')
    const [washingMachineSort, setWashingMachineSort] = useState('')

    const [showDelete, setShowDelete] = useState(false);
    const [showDeleteId, setShowDeleteId] = useState('');
    const [showDeleteName, setShowDeleteName] = useState('');
    const [showDeleteBranchName, setShowDeleteBranchName] = useState('');
    const [errorMsg, setErrorMsg] = useState(1);
    

    const [isShowLog, setIsShowLog] = useState({
        show: false,
        type: 0,
        data: {}
    })
    const [isShowError, setIsShowError] = useState({
        show: false,
        data: {}
    })
    const handleDeleteSubmit = async () => {
        let param = {
            status: 99,
            statusActive:'DELETE',
        }
        const resAll = await Database.DashboardGetAllData('all')
        const resAllBranch = await Database.DashboardGetAllData(showDeleteId.branch)
        if(resAllBranch.val()){
            await Database.DashboardSetData(showDeleteId.branch,showDeleteId.machineType == 1 ? { totalWashingMachines : (resAllBranch.val()?.totalWashingMachines || 0) - 1} : { totalIncubators : (resAllBranch.val()?.totalIncubators || 0) - 1})
        }else{
            await Database.DashboardSetData(showDeleteId.branch,showDeleteId.machineType == 1 ? { totalWashingMachines : 0} : { totalIncubators : 0})
        }
        await Database.DashboardSetData('all',showDeleteId.machineType == 1 ?  { totalWashingMachines : (resAll.val()?.totalWashingMachines || 0) - 1} : { totalIncubators : (resAll.val().totalIncubators || 0) + 1})
        await Database.WashingMachineUpdateByKey(showDeleteId.docId, param)
        await getWashingMachineFilter(branchFilter)
        handleDeleteClose()
    }

    const handleDeleteClose = () => {
        setShowDelete(false)
    }

    const onDelete = (res) => {
        setShowDeleteId({docId:res.docId,branch:res.branch,machineType:res.machineType})
        setShowDeleteName(res.name)
        setShowDeleteBranchName(res.branchName)
        setShowDelete(true)
    }

    useEffect(() => {
        if (!_.isUndefined(washingMachineData)) {
            setWashingMachineSort('')
            setWashingMachine(_.filter(_.values(washingMachineData), (e) => e.status != 99 && e.status))
        }
    }, [washingMachineData])

    useEffect(() => {
        getWashingMachineFilter(branchFilter)
    }, [branchFilter])

    const sortASC = () => {
        setWashingMachineSort('down')
        let data = _.orderBy(washingMachine, "name", "asc")
        setWashingMachine(data)
    }

    const sortDESC = () => {
        setWashingMachineSort('up')
        let data = _.orderBy(washingMachine, "name", "desc")
        setWashingMachine(data)
    }
    const onLog = (data, type) => {
        AddLogAdmin(userData, 'Machine', `Open Log Machine : ${data.name}`)
        setIsShowLog({
            show: true,
            type,
            data: data
        })
    }
    const setStatusError = (e) =>{
        
        setErrorMsg(e.errorMsg || 1)
        setIsShowError({
            show: true,
            data: e
        })
    }
    const renderItemTable = (res, index) => {
        let nameStatus = 'Offline'
        let colorText = 'text-danger'
        if(res.errorMsg){
            nameStatus = 'Error'
        }else if(res.connectStatus === 1){
            nameStatus = 'Online'
            colorText = 'text-success'
        }
        return (
            <tr key={index}>
                <td className="px-2">{index}</td>
                <td className="px-2">{res.branchName}</td>
                <td className="px-2"><Button variant="link" className="p-0" onClick={() => onLog(res, 1)}>{res.name}</Button></td>
                <td className="px-2">{res.id}</td>
                <td className="px-2"><Button variant="link" className="p-0" onClick={() => onLog(res, 2)}>{res.idIOT}</Button></td>
                <td className="px-2"><span style={{backgroundColor:res.machineType == 1 ? "#7DB0D1":"#FE7F83",padding:5,borderRadius:5}}>{res.machineType == 1 ? language['global_washing_machine'] : language['global_dryer_machine']}</span></td>
                <td className="px-2"><Button variant="link" className="p-0" onClick={() => setStatusError(res)}><span className={colorText}>{nameStatus}</span></Button></td>
                <td className="px-2 d-flex justify-content-between">
                    {
                        userData.type === 1 &&
                        <>
                        <div>
                            <Button variant="link" className="p-0 btn-edit" onClick={() => onEdit(res)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                        </div>

                            <Button variant="link" className="py-0 btn-delete" onClick={() => onDelete(res)}>
                            <i className="fas fa-trash-alt"></i>
                            </Button>
                        </>
                    }
                </td>
            </tr>
        )
    }
    const handleClose = () => {
        setIsShowError({
            show: false,
            data: {}
        })
    }
    const fnItemTable = () => {
        let item = []
        let index = 0
        if (permission.length) {
            washingMachine.map((res, key1) => {
                if (_.find(permission, e => e.docId === res.branch)) {
                    index++
                    item.push(renderItemTable(res, index))
                }
            })
        } else {
            washingMachine.map((res, key1) => {
                index++
                item.push(renderItemTable(res, index))
            })
        }

        return item
    }
    const handleSubmit = async () =>{
        try {
            const form = refForm.current
            await Database.WashingMachineUpdateByKey(isShowError.data.docId, {errorMsg: form['errorMsg'].value == 2 ? 2:''})
            await getWashingMachine()
            handleClose()
        } catch (error) {
            console.log(`error`, error)
        }
    }
    return (
        <>
            <Modal show={showDelete} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{language['washing_machine_title_7']} {showDeleteName} {language['global_branch']} {showDeleteBranchName}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleDeleteClose()}>
                    <i className="fas fa-window-close"></i> {language['global_cancel']}
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteSubmit()}>
                    <i className="fas fa-trash-alt"></i> {language['global_delete']}
                    </Button>
                </Modal.Footer>
            </Modal>
            {
                isShowLog.show ?
                    <>
                        {
                            isShowLog.type === 1 &&
                            < LogMachine data={isShowLog.data} back={() => setIsShowLog({
                                show: false,
                                type: 0,
                                data: {}
                            })} />
                        }
                        {
                            isShowLog.type === 2 &&
                            <LogIOT data={isShowLog.data} back={() => setIsShowLog({
                                show: false,
                                type: 0,
                                data: {}
                            })} />
                        }
                    </>
                    :
                    <>
                        <Row className="justify-content-end">
                            <Col className="py-2 text-end" md={2}>
                                <Form.Select
                                    onChange={(e) => { setBranchFilter(e.target.value) }}
                                    name={'branch'}
                                >
                                    <option value={''}>{language['program_title_2']}</option>
                                    {branchData.map((res, index) => {
                                        if (permission.length) {
                                            if(_.find(permission, e => e.docId === res.docId)){
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
                        </Row>
                        <Col className="tableNoWrap">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>#</th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['global_branch_name']}</th>
                                    <th className="px-2 justify-content-between d-flex align-items-center">{language['global_machine_name']}
                                        {
                                            washingMachineSort == '' &&
                                            <Button variant="link" onClick={() => sortASC()}>
                                                <i className="fas fa-sort" style={{ cursor: "pointer" }}></i>
                                            </Button>
                                        }
                                        {
                                            washingMachineSort == 'up' &&
                                            <Button variant="link" onClick={() => sortASC()}>
                                                <i className="fas fa-sort-up" style={{ cursor: "pointer" }}></i>
                                            </Button>
                                        }
                                        {
                                            washingMachineSort == 'down' &&
                                            <Button variant="link" onClick={() => sortDESC()}>
                                                <i className="fas fa-sort-down" style={{ cursor: "pointer" }}></i>
                                            </Button>
                                        }
                                    </th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['washing_machine_title_2']}</th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['washing_machine_title_3']}</th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['washing_machine_title_1']}</th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['global_status']}</th>
                                    <th className="px-2" style={{ verticalAlign: "baseline" }}>{language['global_tool']}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_.isArray(washingMachine) && fnItemTable()}
                            </tbody>
                        </Table>
                        </Col>
                    </>
            }
            <Modal show={isShowError.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{language['washing_machine_title_8']}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form noValidate  ref={refForm} >
                    <Form.Group as={Col} className="pb-2">
                        <Form.Label>{language['customer_select_1']}</Form.Label>
                        <Form.Select  name="errorMsg" value={errorMsg} onChange={(e) => setErrorMsg(e.target.value)} required>
                            <option value="1">{language['global_online']}</option>
                            <option value="2">{language['global_error']}</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>
                        <i className="fas fa-window-close"></i> {language['global_cancel']}
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit()}>
                        <i className="fas fa-save"></i> {language['global_save']}
                        </Button>
                    </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        washingMachine: { data: washingMachineData },
        branch: { data: branchData },
        user: {
            data: userData,
            permission
        },
        ui: {language }
    } = state
    return {
        washingMachineData,
        branchData,
        userData,
        permission,
        language
    }
}

const mapDispatchToProps = {
    getWashingMachineFilter: WashingMachineActions.getWashingMachineFilter,
    getWashingMachine: WashingMachineActions.getWashingMachine
}

export default connect(mapStateToProps, mapDispatchToProps)(ListWashingMachine)
