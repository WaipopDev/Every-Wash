import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    FormControl
} from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";
import DatePicker from "react-datepicker";
import { Database } from '../../firebase'
import { numberWithSeparators } from '../../utils/helpers'
import { WalletAction } from '../../redux/actions'

import _ from 'lodash';

export const WalletReport = (props) => {
    const { setShowReport, getWalletFilter, wallet, permission, language } = props

    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [startDate, setStartDate]       = useState(new Date());
    const [endDate, setEndDate]           = useState(new Date());
    const [data, setData]                 = useState([])
    const [activity, setActivity]         = useState('')
    const [firstName, setFirstName]       = useState('')
    const [textUser, setTextUser]         = useState('')
    const [defaultTransaction, setDefaultTransaction] = useState([]);

    const [dataRender, setDataRender] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {

        let startDateFormat = moment(startDate).format('YYYY-MM')
        getWalletFilter(startDateFormat, 1, firstName)
        const handlerTransaction = async () => {
            const res = await Database.GetDataTransaction(moment(startDate).format('YYYY-MM'))
            setDefaultTransaction(_.values(res.val()))
        }
        handlerTransaction()
    }, [startDate, endDate])

    useEffect(() => {
        if(defaultTransaction.length){
            let dataReportData = wallet
    
            dataReportData = _.filter(dataReportData, (e) => {
                let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
                let endTime = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
                if (startTime <= e.date && e.date <= endTime) {
                    return e
                }
            })
    
            let item = []
            _.map(dataReportData, (res, index) => {
                if (textUser && !_.lowerCase(dataReportData.firstName).includes(_.lowerCase(textUser))) {
                    return;
                }
                const transaction = _.find(defaultTransaction, (ei) => ei.transactionId === res.refWallet)
                if (transaction) {
                    res.payerName = transaction.payerName
                }

                // if (textUserAccount && !_.lowerCase(e.nameUser).includes(_.lowerCase(textUserAccount))) {
                //     return;
                // }
                if (permission.length) {
                    if (_.find(permission, e => e.docId === res.branchId)) {
                        item.push(res)
                    }
                } else {
                    item.push(res)
                }
            })
            setTotalSales(_.sumBy(item, (e) => { return Number(e.amount) }))
            setDataRender(item)
        }
    }, [wallet, textUser, startDate, endDate, defaultTransaction])

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
        _.map(_.orderBy(dataRender, 'date', 'desc'), (res, index) => {
            item.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {moment(res.date * 1000).format('DD-MM-YYYY HH:mm:ss')}
                    </td>
                    <td>
                        {res.refWallet}
                    </td>
                    <td>
                        {res.ref1}
                    </td>
                    <td>
                        {res.ref2}
                    </td>
                    <td>
                        {`${res.payerName}`}
                    </td>
                    <td>
                        {`${res.firstName}`}
                    </td>
                    <td className="text-end">
                        {numberWithSeparators(res.amount)}
                    </td>
                </tr>
            )
        })
        return item
    }
    const onReport = () => {

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
                                        <i class="fas fa-file-download"></i> {language['report_export_to_excel']}
                                    </Button>
                                }
                                filename="top up report"
                            // hideElement={true}
                            >
                                <ExcelSheet data={dataRender} name="top up report">
                                    <ExcelColumn label={language['report_table_1']} value={(e) => moment(e.date * 1000).format('DD-MM-YYYY HH:mm:ss')} />
                                    <ExcelColumn label={language['report_table_2']} value="refWallet" />
                                    <ExcelColumn label="Ref1" value="ref1" />
                                    <ExcelColumn label="Ref2" value="ref2" />
                                    <ExcelColumn label={language['global_account_name']} value={(e) => `${e.payerName}`} />
                                    <ExcelColumn label={language['global_username']} value={(e) => `${e.firstName}`} />
                                    <ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value={(e) => Number(e.amount)} />
                                </ExcelSheet>
                            </ExcelFile>
                        </Col>
                    }

                </Col>
            </Row>
            <Row className="justify-content-end">
                <Col className="py-2" md={8}>
                    <Button onClick={() => setShowReport({})} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_8']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_3']}
                        onChange={(e) => setTextUser(e.target.value)}
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
                    <h4>{language['report_5']}</h4>
                </Col>
            </Row>
            <Row>
                <h4>{language['report_total_amount']} : {numberWithSeparators(totalSales)} {language['global_baht']}</h4>
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
                                <th>{language['global_account_name']}</th>
                                <th>{language['global_username']}</th>
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
        wallet: {
            data: wallet
        },
        ui: { language }
    } = state
    return {
        wallet,
        permission,
        language
    }
}

const mapDispatchToProps = {
    getWalletAll: WalletAction.getWalletAll,
    getWalletFilter: WalletAction.getWalletFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletReport)
