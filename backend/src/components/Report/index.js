import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card
} from 'react-bootstrap'
import moment from 'moment'
import DatePicker from "react-datepicker";

import SalesReport from './SalesReport'
import WalletReport from './WalletReport'
import WashingReport from './WashingReport'
import UserReport from './UserReport'
import SalesMonthReport from './SalesMonthReport'
import TransactionBankReport from './TransactionBankReport'
import TransactionBankReport2 from './TransactionBankReport2'
import TransactionBankReport3 from './TransactionBankReport3'
import TransactionWalletReport from './TransactionWalletReport'
import TransactionPaymentSalesReport from './TransactionPaymentSalesReport'

import { Database } from '../../firebase'
import { reverseObject } from '../../utils/helpers'
import _ from 'lodash';

export const Report = (props) => {
    const { userData, language } = props
    const [startDate, setStartDate] = useState(new Date());
    const [data, setData] = useState([])
    const [showReport, setShowReport] = useState({})

    useEffect(() => {
        const item = [
            {
                id: 1,
                name: language['report_1'],//รายงานข้อมูลรายรับสาขา
                permission: [1, 2, 3]
            },
            {
                id: 5,
                name: language['report_2'],//รายงานสรุปรายรับสาขารายเดือน
                permission: [1, 2, 3]
            },
            // {
            //     id: 2,
            //     name: 'รายงานการใช้บริการร้านสะดวกซักรายสาขา',
            //     permission: [1, 2]
            // },
            {
                id: 4,
                name: language['report_3'],//รายงานข้อมูลการตัดเงินจากบัตรสมาชิกเพื่อชำระค่าบริการ
                permission: [1, 2]
            },
            {
                id: 7,
                name: language['report_4'],//รายงานข้อมูลการตัดเงินจากพร้อมเพย์เพื่อชำระค่าบริการ (ธนาคารไทยพาณิชย์)
                permission: [1,3]
            },
            {
                id: 3,
                name: language['report_5'],//รายงานข้อมูลการเติมเงินเข้าบัตรสมาชิก
                permission: [1]
            },
            {
                id: 6,
                name: language['report_6'],//รายงานข้อมูลการตัดเงินจากพร้อมเพย์เพื่อเติมเงินเข้าบัตรสมาชิก (ธนาคารไทยพาณิชย์)
                permission: [1]
            },
            
            {
                id: 8,
                name: language['report_7'],//รายงานข้อมูลการใช้บริการของสมาชิก
                permission: [1]
            },
            {
                id: 9,
                name: language['report_8'],//รายงานข้อมูลการโอนคืนสาขา
                permission: [1]
            },
            {
                id: 10,
                name: language['report_9'],//รายงานข้อมูลการตัดเงินจากพร้อมเพย์เพื่อชำระค่าบริการ (ธนาคารกสิกรณ์)
                permission: [1,3]
            }
        ]


        setData(item)
    }, [language])
    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {`${language['report_time_1']} : ` + moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    const renderTbody = () => {
        let item = []
        let iIndex = 0
        _.map(data, (res, index) => {
            if (_.includes(res.permission, userData.type)) {
                item.push(
                    <tr key={index}>
                        <td>{iIndex + 1}</td>
                        <td>
                            <Button variant="link" className="p-0" onClick={() => setShowReport(res)}>
                                {res.name}
                            </Button>
                        </td>
                    </tr>
                )
                iIndex++
            }
        })
        return item
    }
    let renderReport = null
    if (!_.isUndefined(showReport.id)) {
        switch (showReport.id) {
            case 1:
                renderReport = <SalesReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 2:
                renderReport = <WashingReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 3:
                renderReport = <WalletReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 4:
                renderReport = <UserReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 5:
                renderReport = <SalesMonthReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 6:
                renderReport = <TransactionBankReport setShowReport={(e) => setShowReport(e)} typeChannel={1} />
                break;
            case 7:
                renderReport = <TransactionBankReport2 setShowReport={(e) => setShowReport(e)} typeChannel={2} />
                break;
            case 8:
                renderReport = <TransactionWalletReport setShowReport={(e) => setShowReport(e)} typeChannel={2} />
                break;
            case 9:
                renderReport = <TransactionPaymentSalesReport setShowReport={(e) => setShowReport(e)} />
                break;
            case 10:
                renderReport = <TransactionBankReport3 setShowReport={(e) => setShowReport(e)} typeChannel={2} />
                break;
            default:
                renderReport = null
                break;
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
                                    <h4>{language['report_management']}</h4>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body >
                            {
                                renderReport === null ?
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{language['report']}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderTbody()}
                                        </tbody>
                                    </Table>
                                    :
                                    renderReport
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        },
        ui: { language }
    } = state
    return { userData, language }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
