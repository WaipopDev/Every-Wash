import React, { useState, useEffect, createRef } from 'react'
import { connect } from 'react-redux'
import { Database } from '../../firebase'
import ListWashingMachine from './ListWashingMachine'
import { WashingMachineActions } from '../../redux/actions'
import { generateRandomNumber, reponseDatabase, makeid } from '../../utils/helpers'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form,
    Alert,
    InputGroup
} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

export const WashingMachine = (props) => {
    const refForm = createRef()
    const { branchData, programWashingMachine, programClothesDryer, getWashingMachine, washingMachineData, userData,permission, language } = props

    const [show, setShow]               = useState(false);
    const [validated, setValidated]     = useState(false);
    const [branch, setBranch]           = useState([])
    const [machineType, setMachineType] = useState(1)

    const [washingMachine, setWashingMachine]           = useState([])
    const [clothesDryer, setClothesDryer]               = useState([])
    const [errorMsg, setErrorMsg]                       = useState('')
    const [dataUpdate, setDataUpdate]                   = useState({})
    const [washingMachineCheck, setWashingMachineCheck] = useState([])
    const [programSort1, setProgramSort1]               = useState('')
    const [programSort2, setProgramSort2]               = useState('')
    const [sizeList1, setSizeList1]                     = useState([])
    const [sizeList2, setSizeList2]                     = useState([])
    const [branchActive, setBranchActive]               = useState('')

    const fnGetProgramWashingMachine = async () => {
        const res = await programWashingMachine
            setSizeList1(Object.keys(_.groupBy(res,'size')))
            setWashingMachine(_.sortBy(res,['size','name']))
    }

    const fnProgramClothesDryer = async () => {
        const res = await programClothesDryer
        setSizeList2(Object.keys(_.groupBy(res,'size')))
        setClothesDryer(_.sortBy(res,['size','name']))
    }

    useEffect(() => {
   
        if (branchData.length) {
            setBranch(branchData)
        }
        if (_.isFunction(programWashingMachine.then)) {
            fnGetProgramWashingMachine()
        }
        if (_.isFunction(programClothesDryer.then)) {
            fnProgramClothesDryer()
        }
    }, [branchData, programWashingMachine, programClothesDryer])
    //    const a = _.replace('58990950WL4000WLPAYWALLET58990950WLT1632985271',new RegExp("0WL","g"),'-')

    //    console.log(`a`, _.split(a,'-'))
    const handleClose = () => {
        setShow(false)
        setValidated(false)
        setErrorMsg('')
        setDataUpdate({})
        setWashingMachineCheck([])
        setBranchActive('')
    }
    const handleShow = () => setShow(true)

    const handleSubmit = async () => {
        try {
            const form = refForm.current

            if (form.checkValidity() === true) {
                const findId = _.find(washingMachineData, e => e.id === form['id'].value || e.idIOT === form['idIOT'].value)
                if (findId && _.isUndefined(dataUpdate.id)) {
                    setErrorMsg('ID เครื่อง หรือ ID IOT นี้ถูกใช้งานแล้ว')
                } else if (washingMachineCheck.length === 0) {
                    setErrorMsg('โปรดเลือกโปรแกรม')
                } else {
                    const findBranch = _.find(branch, e => e.docId === form['branch'].value)

                    if (!_.isUndefined(dataUpdate.id)) {
                        let param = {
                            branch          : findBranch.docId,
                            branchName      : findBranch.name,
                            branchLatitude  : findBranch.latitude,
                            branchLongitude : findBranch.longitude,
                            resourceOwnerId : findBranch.resourceOwnerId || '',
                            requestUId      : findBranch.requestUId || '',
                            resourceSecretId: findBranch.resourceSecretId || '',
                            ppId            : findBranch.ppId || '',
                            name: form['name'].value,
                            id: form['id'].value,
                            idIOT: form['idIOT'].value,
                            intervalTime: form['intervalTime'].value,
                            statusActive:'ACTIVE'
                        }
                        if (findBranch.idIOT !== form['idIOT'].value) {
                            param.connectAt = null
                            param.connectStatus = null
                        }
                        param.program = {}
                        for (let index = 0; index < washingMachineCheck.length; index++) {
                            const element = washingMachineCheck[index];
                            const id = element.docId || element.id
                            param.program[id] = {
                                name            : element.name,
                                price           : element.price,
                                status          : element.status,
                                time            : element.time,
                                id              : id,
                                order           : index,
                                size            : element.size,
                                waterTemperature: element.waterTemperature || '',
                                branch          : element.branch || ''
                            }
                        }
                        await Database.WashingMachineUpdateByKey(dataUpdate.docId, param)
                        await getWashingMachine()
                        handleClose()
                    } else {
               
                        setDataMachine(form, findBranch)
                    }


                }

            } else {
                setValidated(true);
            }
        } catch (error) {
            console.log(`error`, error)
        }
    }

    const setDataMachine = async (form, findBranch) => {
        // const key = generateRandomNumber(1000, 9999)
        const key = makeid(4)
        const reCheck = await Database.WashingMachineGetByChild('ref', key)
        if (reponseDatabase(reCheck).length === 0) {
           const resAll = await Database.DashboardGetAllData('all')
           const resAllBranch = await Database.DashboardGetAllData(findBranch.docId)
    
            let param = {
                branch          : findBranch.docId,
                branchName      : findBranch.name,
                branchLatitude  : findBranch.latitude,
                branchLongitude : findBranch.longitude,
                resourceOwnerId : findBranch.resourceOwnerId || '',
                requestUId      : findBranch.requestUId || '',
                resourceSecretId: findBranch.resourceSecretId || '',
                ppId            : findBranch.ppId || '',
                machineType     : form['machineType'].value,
                name            : form['name'].value,
                id              : form['id'].value,
                idIOT           : form['idIOT'].value,
                intervalTime    : form['intervalTime'].value,
                status          : 1,
                use             : null,
                ref             : key,
                statusActive    : 'ACTIVE'
            }
            param.program = {}
            for (let index = 0; index < washingMachineCheck.length; index++) {
                const element = washingMachineCheck[index];
                param.program[element.docId] = {
                    name            : element.name,
                    price           : element.price,
                    status          : element.status,
                    time            : element.time,
                    id              : element.docId,
                    order           : index,
                    size            : element.size,
                    waterTemperature: element.waterTemperature || '',
                    branch          : element.branch || ''
                }
            }
          
            await Database.WashingMachineAdd(param)   
                  
                if(resAllBranch.val()){
                    await Database.DashboardSetData(findBranch.docId,param.machineType == 1 ? { totalWashingMachines : (resAllBranch.val()?.totalWashingMachines || 0) + 1} : { totalIncubators : (resAllBranch.val()?.totalIncubators || 0) + 1})
                }else{
                    await Database.DashboardSetData(findBranch.docId,param.machineType == 1 ? { totalWashingMachines : 1} : { totalIncubators : 1})
                }
                await Database.DashboardSetData('all',param.machineType == 1 ? { totalWashingMachines : (resAll.val()?.totalWashingMachines || 0) + 1} : { totalIncubators : (resAll.val()?.totalIncubators || 0) + 1})
            await getWashingMachine()
            handleClose()
        } else {
            setDataMachine(form, findBranch)
        }
    }

    const isUpdtaData = (data) => {
        handleShow()
        const program = _.orderBy(data.program, 'order', 'asc')
        setDataUpdate(data)
        setWashingMachineCheck(program)
    }
    const checkProgram = (data,index) => {
        const findId = _.findIndex(washingMachineCheck, e => e.docId === data.docId)
        let item = _.cloneDeepWith(washingMachineCheck)
        if (findId >= 0) {
            item.splice(index,1)
            // delete item[findId]
            setWashingMachineCheck(_.compact(item))
        } else {
            item.push(data)
            setWashingMachineCheck(item)
        }

    }

    return (
        <>
            <Container fluid>
                <Row className="py-md-4">
                    <Col>
                        <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                            <Card.Header className="bg-transparent pt-3">
                                <Row>
                                    <Col>
                                        <h4>{language['washing_machine_management']}</h4>
                                    </Col>
                                    <Col className="text-end">
                                        {
                                            userData.type === 1 &&
                                            <Button onClick={() => handleShow()}><i className="fas fa-plus"></i> {language['washing_machine_add']}</Button>
                                        }
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <ListWashingMachine onEdit={(data) => isUpdtaData(data)} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{!_.isUndefined(dataUpdate.name) ? language['washing_machine_edit'] : language['washing_machine_add']} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            errorMsg &&
                            <Alert variant={'danger'}>
                                {errorMsg}
                            </Alert>
                        }
                        <Form noValidate validated={validated} ref={refForm} >
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_branch']}</Form.Label>
                                <Form.Select name="branch" required defaultValue={dataUpdate.branch} onChange={(e)=> setBranchActive(e.target.value)}>
                                    <option value="">{language['program_title_2']}</option>
                                    {branch.map((res, index) => {
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
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['washing_machine_title_1']}</Form.Label>
                                <Form.Select disabled={!_.isUndefined(dataUpdate.machineType)} name="machineType" value={!_.isUndefined(dataUpdate.machineType) ? dataUpdate.machineType : machineType} onChange={(e) => setMachineType(e.target.value)} required>
                                    <option value="1">{language['global_washing_machine']}</option>
                                    <option value="2">{language['global_dryer_machine']}</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['global_machine_name']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder={`${language['global_machine_name']} ...`}
                                    required
                                    defaultValue={dataUpdate.name}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['washing_machine_title_2']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    placeholder="xxx-123"
                                    required
                                    defaultValue={dataUpdate.id}
                                //disabled={!_.isUndefined(dataUpdate.id)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['washing_machine_title_3']}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="idIOT"
                                    placeholder="xxx-123"
                                    required
                                    defaultValue={dataUpdate.idIOT}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                                <Form.Label>{language['washing_machine_title_4']}</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        name="intervalTime"
                                        placeholder="60"
                                        required
                                        defaultValue={dataUpdate.intervalTime || 60}
                                    />
                                    <InputGroup.Text>{language['program_title_6']}</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} className="pb-2">
                            <Form.Label>{language['washing_machine_title_5']}</Form.Label>
                                {
                                    washingMachineCheck.map((res, index) => {
                                        return (
                                            <div className="form-check py-1"  key={index}>
                                                <Form.Check
                                                  
                                                    type="checkbox"
                                                    name="program"
                                                    value={res.docId}
                                                    // label={`${index + 1}.) ${res.name} ขนาด ${res.size} ราคา ${res.price}`}
                                                    onChange={(e) => checkProgram(res,index)}
                                                    checked
                                                    id={`flexCheckIndeterminateChecked${index}`}
                                                />
                                                 <label className="form-check-label d-flex justify-content-between line-hover" htmlFor={`flexCheckIndeterminateChecked${index}`}>
                                                    <span style={{minWidth:120}}>{`${index + 1}.) ${res.name}`}</span>
                                                    <span style={{minWidth:110}}>{`${language['global_size']} ${res.size}`}</span>
                                                    <span style={{minWidth:110}}>{`${language['global_price']} ${res.price}`}</span>
                                                    <span style={{minWidth:110}}>{`${language['program_title_3']} ${res.waterTemperature || ''}`}</span>
                                                    <span style={{minWidth:110}}>{`${language['program_title_5']} ${res.time}`}</span>
                                                    
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                             </Form.Group>
                             <Form.Group as={Col} className="pb-2">
                                 <div className="row">
                                     <div className="col-6">
                                     <Form.Label>{language['washing_machine_title_6']}</Form.Label>
                                     </div>
                                     <div className="col-6">
                                    <Form.Select  name="programSort" value={(!_.isUndefined(dataUpdate.machineType) ? dataUpdate.machineType : machineType) == 1 ? programSort1:programSort2} onChange={(e) => (!_.isUndefined(dataUpdate.machineType) ? dataUpdate.machineType : machineType) == 1 ? setProgramSort1(e.target.value) : setProgramSort2(e.target.value)}>
                                        <option value="">{language['program_title_7']}</option>
                                        {
                                            (!_.isUndefined(dataUpdate.machineType) ? dataUpdate.machineType : machineType) == 1 ?
                                            sizeList1.map((res,index)=>{
                                                return <option key={res} value={res}>{res}</option>
                                            })
                                            :
                                            sizeList2.map((res,index)=>{
                                                return <option key={res} value={res}>{res}</option>
                                            })
                                        }
                                        
                                    </Form.Select>
                                     </div>
                                  
                                 </div>
                               
                                {
                                    (!_.isUndefined(dataUpdate.machineType) ? dataUpdate.machineType : machineType) == 1 ?
                                        washingMachine.map((res, index) => {
                                            const findItem = _.find(washingMachineCheck, e => e.docId === res.docId || e.id === res.docId)
                                            let check = true
                                            let checkBranch = false
                                            if(programSort1){
                                                check = false
                                                if(programSort1 === res.size){
                                                    check = true
                                                }
                                            }
                                           const ba = branchActive ? branchActive : dataUpdate.branch
                                            if(ba){
                                                //checkBranch = false
                                                if(res.branch && res.branch === ba){
                                                    checkBranch = true
                                                }
                                                //if(_.isUndefined(res.branch)){
                                                //    checkBranch = true
                                                //}
                                            }
                                            if (!findItem && check && checkBranch) {
                                                return (
                                                    <div className="form-check py-1"  key={index}>
                                                        <Form.Check
                                                           
                                                            type="checkbox"
                                                            name="program"
                                                            value={res.docId}
                                                            // label={`${res.name}  ขนาด ${res.size} ราคา ${res.price} อุณหภูมิน้ำ ${res.waterTemperature || ''} ระยะเวลา ${res.time}`}
                                                            onClick={(e) => checkProgram(res,index)}
                                                            id={`flexCheckIndeterminate${index}`}
                                                        />
                                                        <label className="form-check-label d-flex justify-content-between line-hover" htmlFor={`flexCheckIndeterminate${index}`}>
                                                            <span style={{minWidth:120}}>{`${res.name}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['global_size']} ${res.size}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['global_price']} ${res.price}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['program_title_3']} ${res.waterTemperature || ''}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['program_title_5']} ${res.time}`}</span>
                                                            
                                                        </label>
                                                    </div>
                                                )
                                            }
                                        })
                                        :
                                        clothesDryer.map((res, index) => {
                                            const findItem = _.find(washingMachineCheck, e => e.docId === res.docId || e.id === res.docId)
                                            let checkBranch = false
                                            let check = true
                                            if(programSort2){
                                                check = false
                                                if(programSort2 === res.size){
                                                    check = true
                                                }
                                            }
                                             const ba = branchActive ? branchActive : dataUpdate.branch
                                            if(ba){
                                                //checkBranch = false
                                                if(res.branch && res.branch === ba){
                                                    checkBranch = true
                                                }
                                                //if(_.isUndefined(res.branch)){
                                                //    checkBranch = true
                                                //}
                                            }
                                            if (!findItem && check && checkBranch) {
                                                return (
                                                    <div className="form-check py-1"  key={index}>
                                                        <Form.Check
                                                    
                                                            type="checkbox"
                                                            name="program"
                                                            value={res.docId}
                                                            // label={`${res.name} ขนาด ${res.size} ราคา ${res.price} อุณหภูมิน้ำ ${res.waterTemperature} ระยะเวลา ${res.time}`}
                                                            onClick={(e) => checkProgram(res,index)}
                                                        />
                                                         <label className="form-check-label d-flex justify-content-between line-hover" htmlFor={`flexCheckIndeterminate${index}`}>
                                                            <span style={{minWidth:120}}>{`${res.name}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['global_size']} ${res.size}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['global_price']} ${res.price}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['program_title_3']} ${res.waterTemperature || ''}`}</span>
                                                            <span style={{minWidth:110}}>{`${language['program_title_5']} ${res.time}`}</span>
                                                            
                                                        </label>
                                                    </div>
                                                )
                                            }
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
        user: { data: userData, permission },
        branch: { data: branchData },
        program: {
            programWashingMachine,
            programClothesDryer
        },
        washingMachine: { data: washingMachineData },
        ui: {language }
    } = state
    return {
        userData,
        permission,
        branchData,
        programWashingMachine,
        programClothesDryer,
        washingMachineData,
        language
    }
}

const mapDispatchToProps = {
    getWashingMachine: WashingMachineActions.getWashingMachine
}

export default connect(mapStateToProps, mapDispatchToProps)(WashingMachine)
