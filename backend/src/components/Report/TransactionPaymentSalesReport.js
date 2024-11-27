import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    FormControl,
    Card,
    Form
} from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";

import DatePicker from "react-datepicker";
import { Firestore, Database } from '../../firebase'
import { numberWithSeparators } from '../../utils/helpers'
import { map, orderBy, filter, lowerCase, find, sumBy } from 'lodash';

import { ReportAction } from '../../redux/actions'

export const TransactionPaymentSalesReport = (props) => {

    const { setShowReport, branchData, reportSalesReportData, getReportSalesReport, permission, language } = props

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [branch, setBranch]                         = useState('')
    const [payType, setPayType]                       = useState('')
    const [textMashing, setTextMashing]               = useState('')
    const [textProgram, setTextProgram]               = useState('')
    const [startDate, setStartDate]                   = useState(new Date());
    const [endDate, setEndDate]                       = useState(new Date());
    const [totalSales, setTotalSales]                 = useState(0);
    const [perfectlyType, setPerfectlyType]           = useState('');
    const [defaultTransaction, setDefaultTransaction] = useState([]);

    const [dataRender, setDataRender] = useState([]);

    useEffect(() => {
        getReportSalesReport(branch, startDate, endDate)
        const handlerTransaction = async () => {
            const res = await Database.GetDataTransaction(moment(startDate).format('YYYY-MM'))
            setDefaultTransaction(_.values(res.val()))
        }
        handlerTransaction()
    }, [branch, startDate, endDate])

    useEffect(() => {
        if(defaultTransaction.length){
            let dataReportData = reportSalesReportData
            dataReportData = filter(dataReportData,(e)=>{
                return e.priceType == 2 || e.priceType == 3
            })
    
            if(payType){
               
                dataReportData = filter(dataReportData,(e)=>{
                    return e.priceType == payType
                })
            }
            if(textMashing){
                dataReportData = filter(dataReportData,(e)=>{
                    return lowerCase(e.nameMachine).includes(lowerCase(textMashing))
                })
            }
            if(textProgram){
                dataReportData = _.filter(dataReportData,(e)=>{
                    return lowerCase(e.nameProgram).includes(lowerCase(textProgram))
                })
            }
            let item = []
            _.map(dataReportData, (res, index) => {
                const transaction = _.find(defaultTransaction, (ei) => ei.transactionId === res.transactionId)
                res.billPaymentRef1 = ''
                res.billPaymentRef2 = ''
                res.payerName = ''
                res.perfectlyType = 1
                if (transaction) {
                    res.billPaymentRef1 = transaction.billPaymentRef1
                    res.billPaymentRef2 = transaction.billPaymentRef2
                    res.payerName       = transaction.payerName
                    res.perfectlyType   = 2
                }
                if(perfectlyType && perfectlyType != res.perfectlyType){
                    return
                }
                if (permission.length) {
                    if (find(permission, e => e.docId === res.branchId)) {
                        item.push(res)
                    }
                } else {
                    item.push(res)
                }
            })
            setTotalSales(sumBy(item, (e) => { 
                    if(e.priceType !== 4){
                        return Number(e.priceProgram)
                    }else{
                        return 0
                    }
            }))
    
            setDataRender(item)
        }
    }, [branch, payType, textMashing, textProgram, reportSalesReportData, defaultTransaction, perfectlyType])

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
                <i className="fas fa-calendar-day"></i> { moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const renderTbody = (res, index) => {
        // console.log('res', index,res)
        const key = res.priceType || 1
        let textType = language['global_coin']//เหรียญ
        switch (key) {
            case 2:
                textType = language['global_prompt_pay']//'พร้อมเพย์'
                break;
            case 3:
                textType = language['global_member_card']//'บัตรสมาชิก'
                break;
            case 4:
                textType = language['global_force']//'Force'
                break;
        }
        return (
            <tr key={index}>
                <td className="px-1">{index + 1}</td>
                <td className="px-1">
                    {moment(res.createAt * 1000).format('DD-MM-YYYY HH:mm:ss')}
                </td>
                <td className="px-1">{res.transactionId || ''}</td>
                <td className="px-1">{res.billPaymentRef1}</td>
                <td className="px-1">{res.billPaymentRef2}</td>
                <td className="px-1">{res.payerName}</td>
                
                <td className="px-1">
                    {res.branchName}
                </td>
                <td className="px-1">
                    {res.machineType === '1' ? language['global_wash'] : language['global_dry']}
                </td>
                <td className="px-1">
                    {res.nameMachine}
                </td>
              
                <td className="px-1">
                    {res.nameProgram}
                </td>
                <td className="px-1">
                    {textType}
                </td>
                <td className="px-1 text-end">
                    {res.priceType === 4 ? '' : numberWithSeparators(res.priceProgram)}
                </td>
                <td className="px-1">
                    {res.perfectlyType === 1 ? language['report_table_select_1'] : language['report_table_select_2']}
                </td>
            </tr>
        )
    }
    const fnTbody = () => {
        let item = []
        let i = 0
        map(orderBy(dataRender,'branchName','asc'), (res, index) => {
                item.push(renderTbody(res, i))
            i++;
        })
        
        return item
    }

    return (
        <>
            <Row className="justify-content-end">
                <Col className="py-2  text-end" md={2} >
                    {
                        dataRender &&
                        <Col>
                            <ExcelFile
                                element={
                                    <Button variant='info'>
                                        <i className="fas fa-file-download"></i> {language['report_export_to_excel']}
                                    </Button>
                                }
                                filename="sales report"
                            // hideElement={true}
                            >
                                <ExcelSheet data={dataRender} name="sales report">
                                    <ExcelColumn label={language['report_table_1']}   value={(e)=>moment(e.createAt * 1000).format('DD-MM-YYYY HH:mm:ss')}  />
                                    <ExcelColumn label={language['report_table_2']} value={e => e.transactionId || ''} />
                                    <ExcelColumn label="Ref1" value="billPaymentRef1" />
                                    <ExcelColumn label="Ref2" value="billPaymentRef2" />
                                    <ExcelColumn label={language['global_account_name']} value="payerName" />
                                    <ExcelColumn label={language['report_table_3']} value="branchName" />
                                    {/* <ExcelColumn label="รหัสเครื่อง" value="id" /> */}
                                    <ExcelColumn label={language['report_table_4']} value={(e)=>e.machineType === '1' ? language['global_wash'] : language['global_dry']} />
                                    <ExcelColumn label={language['global_machine_name']} value="nameMachine" />
                                    <ExcelColumn label={language['global_program_name']} value="nameProgram" />
                                    <ExcelColumn label={language['report_table_5']} value={(e)=> {
                                        const key = e.priceType || 1
                                        let textType = language['global_coin']//เหรียญ
                                        switch (key) {
                                            case 2:
                                                textType = language['global_prompt_pay']//'พร้อมเพย์'
                                                break;
                                            case 3:
                                                textType = language['global_member_card']//'บัตรสมาชิก'
                                                break;
                                            case 4:
                                                textType = language['global_force']//'Force'
                                                break;
                                        }
                                        return textType
                                    }} />
                                    <ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value={(e)=> e.priceType === 4 ? '' : Number(e.priceProgram)} />
                                    <ExcelColumn label={language['report_table_8']} value={(e)=>e.perfectlyType === '1' ? language['report_table_select_1'] : language['report_table_select_2']} />
                                </ExcelSheet>
                            </ExcelFile>
                        </Col>
                    }

                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col className="py-2" >
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
                    <label>{language['report_select_2']} :</label>
                    <Form.Select
                        onChange={(e) => { setPayType(e.target.value) }}
                    >
                        <option value={''}>{language['global_all']}</option>
                        <option value={2}>{language['global_prompt_pay']}</option>
                        <option value={3}>{language['global_member_card']}</option>
                    </Form.Select>
                </Col>
                <Col className="py-2 text-end align-self-end" md={2}>
                    <label>{language['report_select_10']} :</label>
                    <Form.Select
                        onChange={(e) => { setPerfectlyType(e.target.value) }}
                    >
                        <option value={''}>{language['global_all']}</option>
                        <option value={1}>{language['report_table_select_1']}</option>
                        <option value={2}>{language['report_table_select_2']}</option>
                    </Form.Select>
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
                    <h4>{language['report_8']}</h4>
                </Col>
            </Row>
            <Row>
                <h4>{language['report_total_revenue_sales']} : {numberWithSeparators(totalSales)} {language['global_baht']}</h4>
            </Row>
            <Row>
                <Col className="tableNoWrap">
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th className="px-2">#</th>
                                <th className="px-2">{language['report_table_1']}</th>
                                <th className="px-2">{language['report_table_2']} </th>
                                <th className="px-2">Ref1</th>
                                <th className="px-2">Ref2</th>
                                <th className="px-2">{language['global_account_name']}</th>
                                <th className="px-2">{language['report_table_3']}</th>
                         
                                <th className="px-2">{language['report_table_4']}</th>
                                <th className="px-2">{language['global_machine_name']}</th>
                                <th className="px-2">{language['global_program_name']}</th>
                                <th className="px-2">{language['report_table_5']}</th>
                                <th className="px-2">{`${language['global_amount']} (${language['global_baht']})`}</th>
                                <th className="px-2">{language['report_table_8']}</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {fnTbody()}
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
        report: { reportSalesReport: reportSalesReportData },
        ui: { language }
    } = state
    return {
        userData,
        permission,
        branchData,
        reportSalesReportData,
        language
    }
}

const mapDispatchToProps = {
    getReportSalesReport: ReportAction.getReportSalesReport
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionPaymentSalesReport)
