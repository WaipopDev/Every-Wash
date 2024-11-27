import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    Form
} from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";
import { Firestore } from '../../firebase'
import { numberWithSeparators } from '../../utils/helpers'
import LoadProcess from '../PageChange/LoadProcess'

import _ from 'lodash';

import { ReportAction } from '../../redux/actions'

export const SalesReport = (props) => {

    const { setShowReport, branchData, reportSalesMonthReportData, getReportSalesMonthReport,permission, reportSalesMonthReportPendding, language } = props

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [branch, setBranch] = useState('')
    const [startMonth, setStartMonth] = useState(moment(new Date).format('M'));
    const [startYear, setStartYear] = useState(moment(new Date).format('YYYY'));

    const [dataRender, setDataRender] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [showLoadProcess, setShowLoadProcess] = useState(true);

    const month = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    }

    const year = [2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035]

    useEffect(() => {
        getReportSalesMonthReport('', startMonth, startYear)
    }, [branch, startMonth, startYear])

    useEffect(() => {
        if(!reportSalesMonthReportPendding){
            let dataReportData = reportSalesMonthReportData
            if(branch){
                dataReportData = _.filter(dataReportData,(e)=>{
                    return e.branchId === branch
                })
            }
            let item = []
            _.map(dataReportData, (res, index) => {
                if (permission.length) {
                    if (_.find(permission, e => e.docId === res.branchId)) {
                        item.push(res)
                    }
                } else {
                    item.push(res)
                }
            })
            setTotalSales(_.sumBy(item, (e) => { 
                // console.log('e.priceProgram', e.priceProgram)
                    return Number(e.priceProgram) 
            }))
            
            setDataRender(item)
        }else{
            setDataRender([])
            setTotalSales(0)
        }
        setShowLoadProcess(reportSalesMonthReportPendding)
    }, [branch, reportSalesMonthReportData, reportSalesMonthReportPendding])

    const fnTbody = () => {
        let item = []
        let endDate = moment().format('D')

        if(moment().diff(moment(new Date(`${startYear}/${startMonth}/1`),'YYYY/M/D'),'month') > 0){
            endDate = moment(new Date(`${startYear}/${startMonth}/1`),'YYYY/M/D').endOf('month').format('DD')
        }
        _.map(_.orderBy(dataRender,'branchName','asc'), (res, index) => {
            
            item.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{`1-${endDate} ${month[startMonth]}-${startYear}`}</td>
                    <td>
                        {res.branchName}
                    </td>
                    <td>
                        {res.machineType === '1' ? language['global_wash'] : language['global_dry']}
                    </td>
                    <td>
                        {res.nameMachine}
                    </td>
                    
                    <td className="text-end">
                        {numberWithSeparators(res.priceProgram)}
                    </td>
                </tr>
            )

        })
        return item
    }
    return (
        <>
        <LoadProcess isShow={showLoadProcess} />
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
                                filename="monthly sales report"
                            // hideElement={true}
                            >
                                <ExcelSheet data={dataRender} name="monthly sales report">
                                    <ExcelColumn label={language['report_table_6']} value={(e) => {
                                        let endDate = moment().format('D')
                                        if (moment().diff(moment(new Date(`${startYear}/${startMonth}/1`),'YYYY/M/D'),'month') > 0) {
                                            endDate = moment(new Date(`${startYear}/${startMonth}/1`), 'YYYY/M/D').endOf('month').format('DD')
                                        }
                                        return `1-${endDate} ${month[startMonth]}-${startYear}`
                                    }} />
                                    <ExcelColumn label={language['report_table_3']} value="branchName" />
                                    <ExcelColumn label={language['report_table_4']} value={(e) => e.machineType === '1' ? language['global_wash'] : language['global_dry']} />
                                    <ExcelColumn label={language['global_machine_name']} value="nameMachine" />
                                    <ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value={(e) => Number(e.priceProgram)} />
                                </ExcelSheet>
                            </ExcelFile>
                        </Col>
                    }

                </Col>
            </Row>
            <Row className="justify-content-end">
            
                <Col className="py-2">
                    <Button onClick={() => setShowReport({})} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                </Col>
                <Col className="py-2 text-end" md={3}>
                    <label>{language['report_select_1']} :</label>
                    <Form.Select 
                        onChange={ (e) => { setBranch(e.target.value) }}
                        name={'branch'}
                    >
                        <option value={''}>{language['global_all']}</option>
                        {_.orderBy(branchData,'name','asc').map((res, index) => {
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
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_5']} :</label>
                    <Form.Select
                        onChange={ (e) => { setStartMonth(e.target.value) }}
                        name={'startMonth'}
                        defaultValue={startMonth}
                    >
                        { 
                            _.map(Object.keys(month), (key) => {
                                return <option key={key} value={key}>{month[key]}</option>
                            })
                        }
                    </Form.Select>
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_6']} :</label>
                    <Form.Select
                        onChange={ (e) => { setStartYear(e.target.value) }}
                        name={'startYear'}
                        defaultValue={startYear}
                    >

                        { 
                            _.map(year, (val, index)=> {
                                return <option key={index} value={val}>{val}</option>
                            })
                        }
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>{language['report_2']}</h4>
                </Col>
            </Row>
            <Row>
                <h4>{language['report_total_revenue_sales']} : {numberWithSeparators(totalSales)} บาท</h4>
            </Row>
            <Row>
                <Col className="tableNoWrap">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{language['report_table_6']}</th>
                                <th>{language['report_table_3']}</th>
                                <th>{language['report_table_4']}</th>
                                <th>{language['global_machine_name']}</th>
                                <th>{`${language['global_amount']} (${language['global_baht']})`}</th>
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
        user: { data: userData,permission },
        branch: { data: branchData },
        report: { reportSalesMonthReport: reportSalesMonthReportData, reportSalesMonthReportPendding },
        ui: { language }
    } = state
    return {
        userData,
        branchData,
        reportSalesMonthReportData,
        permission,
        reportSalesMonthReportPendding,
        language
    }
}

const mapDispatchToProps = {
    getReportSalesMonthReport: ReportAction.getReportSalesMonthReport
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesReport)
