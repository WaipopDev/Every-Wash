import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    Form,
    FormControl
} from 'react-bootstrap'
import moment from 'moment'
import DatePicker from "react-datepicker";
import ReactExport from "@ibrahimrahmani/react-export-excel";

import { Database, Firestore } from '../../firebase'
import { numberWithSeparators } from '../../utils/helpers'
import _ from 'lodash';
import { ReportAction } from '../../redux/actions'
import { reponseFirestore } from '../../utils/helpers'

export const UserReport = (props) => {
    const { setShowReport, permission, getReportSalesReport, branchData, language } = props

    const [startDate, setStartDate]     = useState(new Date());
    const [endDate, setEndDate]         = useState(new Date());
    const [data, setData]               = useState([])
    const [branch, setBranch]           = useState('')
    const [machineType, setMachineType] = useState('')
    const [textUser, setTextUser]       = useState('')
    const [textMashing, setTextMashing] = useState('')
    const [textProgram, setTextProgram] = useState('')
    const [dataMachine, setDataMachine] = useState(null)
    const [dataUser, setDataUser]       = useState(null)
    const [totalSales, setTotalSales]   = useState(0);
    // const [reportSalesReportData,setReportSalesReportData] = useState(null)
    const ExcelFile   = ReactExport.ExcelFile;
    const ExcelSheet  = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const getDataTransaction = async () => {
        const item = []
        const res = await Database.GetDataTransaction(
            moment(startDate).format('YYYY-MM')
        )
        let dataM = dataMachine
        let dataU = dataUser
        if (!dataMachine) {
            const resMachine = await Database.WashingMachineGetAll()
            setDataMachine(resMachine.val())
            dataM = resMachine.val()
        }
        if (!dataUser) {
            const resUser = await Database.Customer().once('value')
            setDataUser(resUser.val())
            dataU = resUser.val()
        }
        const reportSalesReportData = await Firestore.ReportGetSalesReport('', startDate, endDate)
        let resItem = res.val()
        if (resItem) {
            if(branch){
                resItem = _.filter(resItem,(e)=>{
                    return e.branchId === branch
                })
            }
            _.map(resItem, (e, index) => {
                let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
                let endTime = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
                if (startTime <= moment(e.transactionDateandTime).unix() && moment(e.transactionDateandTime).unix() <= endTime) {
                    if (!_.isUndefined(e.payerAccountNumber) && !_.isUndefined(e.payeeAccountNumber)) {
                        const wallet = _.split(e.billPaymentRef1, "PAYWALLET");
                        if (wallet.length === 2 && wallet[1].length === 4) {

                            e.program = _.filter(dataM, e => e.ref === wallet[1])[0]
                            e.branchName = e.program?.branchName || ''
                            if(machineType && e.program.machineType != machineType){
                                return;
                            }
                            e.program2 = _.find(reponseFirestore(reportSalesReportData), (er) => er.transactionId == e.transactionId)
                            e.dataUser = dataU[e.payerAccountNumber]
                            // e.amount = e.program2.priceProgram
                            if (!_.isUndefined(e.program2)) {
                                e.nameMachine = e.program2.nameMachine
                                e.nameProgram = e.program2.nameProgram
                                if(textUser && !_.lowerCase(e.payerName).includes(_.lowerCase(textUser))){
                                    return;
                                }
                                if(textMashing && !_.lowerCase(e.nameMachine).includes(_.lowerCase(textMashing))){
                                    return;
                                }
                                if(textProgram && !_.lowerCase(e.nameProgram).includes(_.lowerCase(textProgram))){
                                    return;
                                }
                                e.amount = e.program2.priceProgram
                            }else{
                                // console.log('first', e)
                                e['program2'] = {}
                                e['program2']['priceProgram'] = e.amount
                                e['program2']['nameMachine'] = e.program?.name || ''
                                // return;
                            }
                            if (permission.length) {
                                if (_.find(permission, ei => ei.docId === e.branchId)) {
                                    item.push(e)
                                }
                            } else {
                                item.push(e)
                            }
                            // item.push(e)
                        }
                    }
                }
            })
        }
        setTotalSales(_.sumBy(item, (e) => { return Number(e.amount) }))
        setData(item)
    }

    useEffect(() => {
        getReportSalesReport('', startDate, endDate)
        getDataTransaction()
    }, [branch, machineType, textUser, textMashing, textProgram, startDate, endDate])

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const CustomInput2 = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const renderTbody = () => {
        let item = []
        _.map(_.orderBy(data, 'transactionDateandTime', 'desc'), (res, index) => {
            // let createAt = ''
            // if (res.dataUser.createAt) {
            //     createAt = moment(res.dataUser.createAt * 1000).format('DD-MM-YYYY')
            // }
            item.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {moment(res.transactionDateandTime).format('DD-MM-YYYY HH:mm:ss')}
                    </td>
                    <td>
                        {res.transactionId}
                    </td>
                    <td>{res.billPaymentRef1}</td>
                    <td>{res.billPaymentRef2}</td>
                    <td>
                        {res.payerName}
                    </td>
                    <td>
                        {res.branchName || ''}
                    </td>
                    <td>
                        {res.program.machineType === '1' ? language['global_wash'] : language['global_dry']}
                    </td>
                    <td>
                        {res.program2?.nameMachine || ''}
                    </td>
                    <td>
                        {/* {res.program2?.nameProgram || res.program.program[res.programId]?.name} */}
                        {res.program2?.nameProgram  || ''}
                    </td>
                    <td className="text-end">
                        {res.program2?.priceProgram}
                        {/* {res.program.program[res.programId]?.price || ''} */}
                    </td>
                </tr>
            )
        })
        return item
    }

    return (
        <>
            <Row className="justify-content-end">
                <Col className="py-2  text-end" md={2} >
                    {
                        data ?
                            <Col>
                                <ExcelFile
                                    element={
                                        <Button variant='info'>
                                            <i className="fas fa-file-download"></i> {language['report_export_to_excel']}
                                        </Button>
                                    }
                                    filename="user pay report"
                                // hideElement={true}
                                >
                                    <ExcelSheet data={data} name="user pay report">
                                        <ExcelColumn label={language['report_table_1']} value={(e) => moment(e.transactionDateandTime).format('DD-MM-YYYY HH:mm:ss')} />
                                        <ExcelColumn label={language['report_table_2']} value="transactionId" />
                                        <ExcelColumn label="Ref1" value="billPaymentRef1" />
                                        <ExcelColumn label="Ref1" value="billPaymentRef2" />
                                        <ExcelColumn label={language['global_username']} value="payerName" />
                                        <ExcelColumn label={language['report_table_3']} value={(e) => e.program.branchName} />
                                        <ExcelColumn label={language['report_table_4']} value={(e)=>e.program.machineType === '1' ? language['global_wash'] : language['global_dry']} />
                                        <ExcelColumn label={language['global_machine_name']} value={(e) => e.program2?.nameMachine} />
                                        <ExcelColumn label={language['global_program_name']} value={(e) => e.program2?.nameProgram} />
                                        <ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value={(e) => e.program2?.priceProgram} />
                                    </ExcelSheet>
                                </ExcelFile>
                            </Col>
                            : null
                    }

                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col className="py-2">
                    <Button onClick={() => setShowReport({})} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                </Col>
                <Col className="py-2 text-end align-self-end" md={2}>
                    <label>{language['report_select_1']} :</label>
                    <Form.Select
                        onChange={(e) => { setBranch(e.target.value) }}
                        name={'branch'}
                    >
                        <option value={''}>{language['global_all']}</option>
                        {_.orderBy(branchData,'name','asc').map((res, index) => {
                            if (permission.length) {
                                if(find(permission, e => e.docId === res.docId)){
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
                <Col className="py-2 text-end align-self-end" md={2}>
                    <label>{language['report_select_7']} :</label>
                    <Form.Select
                        onChange={(e) => { setMachineType(e.target.value) }}
                    >
                        <option value={''}>{language['global_all']}</option>
                        <option value={1}>{language['global_wash']}</option>
                        <option value={2}>{language['global_dry']}</option>
                    </Form.Select>
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['global_username']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_3']}
                        onChange={(e)=> setTextUser(e.target.value)}
                    />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_3']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_1']}
                        onChange={(e)=> setTextMashing(e.target.value)}
                    />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_4']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_2']}
                        onChange={(e)=> setTextProgram(e.target.value)}
                    />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_time_1']} :</label>
                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_time_2']} :</label>
                    <DatePicker customInput={<CustomInput2 />} selected={endDate} onChange={(date) => setEndDate(date)} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>{language['report_3']}</h4>
                </Col>
            </Row>
            <Row>
                <h4>
                    {language['report_total_amount']} :{' '}
                    {numberWithSeparators(totalSales)} {language['global_baht']}
                </h4>
            </Row>
            <Row>
                <Col className="tableNoWrap">

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{language['report_table_1']}</th>
                                <th>{language['report_table_2']}</th>
                                <th>Ref1</th>
                                <th>Ref2</th>
                                <th>{language['global_username']}</th>
                                <th>{language['report_table_3']}</th>
                                <th>{language['report_table_4']}</th>
                                <th>{language['global_machine_name']}</th>
                                <th>{language['global_program_name']}</th>
                                <th>{`${language['global_amount']} (${language['global_baht']})`}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTbody()}
                        </tbody>
                    </Table>
                </Col>
            </Row>

        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData, permission },
        branch: { data: branchData },
        ui: { language }
    } = state
    return {
        permission,
        branchData,
        language
    }
}

const mapDispatchToProps = {
    getReportSalesReport: ReportAction.getReportSalesReport
}

export default connect(mapStateToProps, mapDispatchToProps)(UserReport)
