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
import DatePicker from "react-datepicker";
import { Firestore } from '../../firebase'
import { reverseObject, numberWithSeparators } from '../../utils/helpers'
import _ from 'lodash';

import { ReportAction } from '../../redux/actions'

export const WashingReport = (props) => {
    const { setShowReport, branchData, reportWashingReportData, getReportWashingReport, permission } = props

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [branch, setBranch] = useState('')
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [dataRender, setDataRender] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [payType, setPayType] = useState('')

    useEffect(() => {
        getReportWashingReport('', startDate, endDate)
    }, [branch, startDate, endDate])

    useEffect(() => {
        let dataReportData = reportWashingReportData
        if (branch) {
            dataReportData = _.filter(dataReportData, (e) => {
                return e.branchId === branch
            })
        }
        if (payType) {

            dataReportData = _.filter(dataReportData, (e) => {
                return e.priceType == payType
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
        setTotalSales(_.sumBy(item, (e) => { if (e.priceType !== 4) return Number(e.priceProgram) }))
        setDataRender(item)
    }, [branch, payType, reportWashingReportData])

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
        _.map(dataRender, (res, index) => {
            const key = res.priceType || 1
            let textType = 'Coin'
            switch (key) {
                case 2:
                    textType = 'PromptPay'
                    break;
                case 3:
                    textType = 'E-wallet'
                    break;
                case 4:
                    textType = 'Force'
                    break;
            }
            item.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {moment(res.createAt * 1000).format('DD-MM-YYYY HH:mm:ss')}
                    </td>
                    <td>
                        {res.branchName}
                    </td>
                    <td>
                        {res.id}
                    </td>
                    <td>
                        {res.nameMachine}
                    </td>
                    <td>
                        {res.machineType === '1' ? 'ซัก' : 'อบ'}
                    </td>
                    <td>
                        {res.nameProgram}
                    </td>
                    <td>
                        {textType}
                    </td>
                    <td className="text-end">
                        {res.priceType !== 4 ? numberWithSeparators(res.priceProgram) : 'Force'}
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
                        dataRender &&
                        <Col>
                            <ExcelFile
                                element={
                                    <Button variant='info'>
                                       <i class="fas fa-file-download"></i> {'Export to Excel'}
                                    </Button>
                                }
                                filename="wash, dry report"
                            // hideElement={true}
                            >
                                <ExcelSheet data={dataRender} name="wash, dry report">
                                    <ExcelColumn label="วันที่-เวลาที่ทำรายการ" value={(e) => moment(e.createAt * 1000).format('DD-MM-YYYY HH:mm:ss')} />
                                    <ExcelColumn label="สาขาที่ทำรายการ" value="branchName" />
                                    <ExcelColumn label="รหัสเครื่อง" value="id" />
                                    <ExcelColumn label="ชื่อเครื่อง" value="nameMachine" />
                                    <ExcelColumn label="ประเภทเครื่อง" value={(e) => e.machineType === '1' ? 'ซัก' : 'อบ'} />
                                    <ExcelColumn label="ชื่อโปรแกรม" value="nameProgram" />
                                    <ExcelColumn label="ช่องทางการชำระเงิน" alue={(e) => {
                                        const key = e.priceType || 1
                                        let textType = 'Coin'
                                        switch (key) {
                                            case 2:
                                                textType = 'PromptPay'
                                                break;
                                            case 3:
                                                textType = 'E-wallet'
                                                break;
                                            case 4:
                                                textType = 'Force'
                                                break;
                                        }
                                        return textType
                                    }} />
                                    <ExcelColumn label="จำนวนเงิน (บาท)" value={(e) => res.priceType !== 4 ? Number(e.priceProgram) : 'Force'} />
                                </ExcelSheet>
                            </ExcelFile>
                        </Col>
                    }

                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col className="py-2">
                    <Button onClick={() => setShowReport({})} variant="secondary"><i className="fas fa-chevron-left"></i> กลับ</Button>
                </Col>
                <Col className="py-2 text-end align-self-end" md={4}>
                    <Form.Select
                        onChange={(e) => { setBranch(e.target.value) }}
                        name={'branch'}
                    >
                        <option value={''}>{'เลือกสาขาที่ทำรายการ'}</option>
                        {branchData.map((res, index) => {
                            if (permission.length) {
                                if (_.find(permission, e => e.docId === res.docId)) {
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
                <Col className="py-2 text-end align-self-end" md={4}>
                    <Form.Select
                        onChange={(e) => { setPayType(e.target.value) }}
                    >
                        <option value={''}>{'เลือกช่องทางการชำระเงิน'}</option>
                        <option value={1}>{'Coin'}</option>
                        <option value={2}>{'Promtpay'}</option>
                        <option value={3}>{'E-wallet'}</option>
                        <option value={4}>{'Force'}</option>
                    </Form.Select>
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>เลือกวันที่แสดง :</label>
                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>ถึงวันที่ :</label>
                    <DatePicker customInput={<CustomInput2 />} selected={endDate} onChange={(date) => setEndDate(date)} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4>รายงานการใช้บริการร้านสะดวกซักรายสาขา</h4>
                </Col>
            </Row>
            <Row>
                <h4>จำนวนเงินทั้งสิ้น : {numberWithSeparators(totalSales)} บาท</h4>
            </Row>
            <Row>
                <Col className="tableNoWrap">

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>วันที่-เวลาที่ทำรายการ</th>
                                <th>สาขาที่ทำรายการ</th>
                                <th>รหัสเครื่อง</th>
                                <th>ชื่อเครื่อง</th>
                                <th>ประเภทเครื่อง</th>
                                <th>ชื่อโปรแกรม</th>
                                <th>ช่องทางการชำระเงิน</th>
                                <th>จำนวนเงิน (บาท)</th>
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
        report: { reportWashingReport: reportWashingReportData }
    } = state
    return {
        userData,
        branchData,
        reportWashingReportData,
        permission
    }
}

const mapDispatchToProps = {
    getReportWashingReport: ReportAction.getReportWashingReport
}

export default connect(mapStateToProps, mapDispatchToProps)(WashingReport)
