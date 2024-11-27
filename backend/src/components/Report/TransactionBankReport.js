import React, { useState, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import { Col, Button, Table, Row, Container, Card, FormControl } from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";
import DatePicker from 'react-datepicker'
import { Database, Firestore } from '../../firebase'
import { numberWithSeparators, weekOfMonth } from '../../utils/helpers'
import _ from 'lodash'

export const TransactionBankReport = props => {
    const { setShowReport, typeChannel, permission, language } = props
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date());
    const [data, setData] = useState([])
    const [dataMachine, setDataMachine] = useState(null)
    const [textUser, setTextUser] = useState('')
    const [textUserAccount, setTextUserAccount] = useState('')
    const [totalSales, setTotalSales] = useState(0);
    const [defaultUsers, setDefaultUsers] = useState([]);

    const getDataTransaction = async () => {
        const item = []
        const res = await Database.GetDataTransaction(moment(startDate).format('YYYY-MM'))
        let dataM = dataMachine
        let resUsersItem = defaultUsers

        if (!dataMachine) {
            const resMachine = await Database.WashingMachineGetAll()
            setDataMachine(resMachine.val())
            dataM = resMachine.val()
        }


        if (res.val()) {
            _.map(res.val(), (e, index) => {
                let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
                let endTime = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
                if (startTime <= moment(e.transactionDateandTime).unix() && moment(e.transactionDateandTime).unix() <= endTime) {
                    if (!_.isUndefined(e.payeeProxyId) && !_.isUndefined(e.payeeProxyType)) {
                        e.program = dataM[e.keyMachine]
                        // if(dataM[e.keyMachine]?.branch == 'mwD8fDulyUvIu5ucwUtV' ){
                        if (textUser && !_.lowerCase(e.payerName).includes(_.lowerCase(textUser))) {
                            return;
                        }
                        e.nameUser = ''


                        const wallet = _.split(e.billPaymentRef1, "WALLET");
                        if (permission.length) {
                            if (_.find(permission, ei => ei.docId === e.keyBranch)) {
                                if (typeChannel === 1 && wallet.length === 2 && wallet[1].length === 9) {
                                    if (resUsersItem) {
                                        const nameUser = _.find(resUsersItem, (ei) => ei.phoneNumber === `+66${wallet[1]}`)
                                        if (nameUser) {
                                            e.nameUser = nameUser.firstName
                                        }
                                    }
                                    if (textUserAccount && !_.lowerCase(e.nameUser).includes(_.lowerCase(textUserAccount))) {
                                        return;
                                    }
                                    item.push(e)
                                }
                            }
                        } else {
                            if (typeChannel === 1 && wallet.length === 2 && wallet[1].length === 9) {
                                if (resUsersItem) {
                                    const nameUser = _.find(resUsersItem, (ei) => ei.phoneNumber === `+66${wallet[1]}`)
                                    if (nameUser) {
                                        e.nameUser = nameUser.firstName
                                    }
                                }
                                if (textUserAccount && !_.lowerCase(e.nameUser).includes(_.lowerCase(textUserAccount))) {
                                    return;
                                }
                                item.push(e)
                            }
                        }
                        // }

                    }
                }

            })
        }

        setTotalSales(_.sumBy(item, (e) => { return Number(e.amount) }))
        setData(item)
    }
    useEffect(() => {
        const handlerUser = async () => {
            const resUsers = await Database.GetDataUser()
            setDefaultUsers(_.values(resUsers.val()))
        }
        handlerUser()
    }, [])

    useEffect(() => {
        if (defaultUsers.length) {
            getDataTransaction()
        }
    }, [startDate, endDate, textUser, textUserAccount, defaultUsers])

    const forceData = async (machine, event) => {
        const pro = _.find(_.values(machine.program), (e) => e.price == Number(event.amount))
        let log = {
            createAt: moment(new Date(event.transactionDateandTime)).unix(),
            id: machine.id,
            idIOT: machine.idIOT,
            nameMachine: machine.name,
            machineType: machine.machineType,
            branchLatitude: machine.branchLatitude,
            branchLongitude: machine.branchLongitude,
            branchName: machine.branchName,
            branchId: machine.branch,
            status: 2,
            errorMsg: '',
            idProgram: pro.id,
            nameProgram: pro.name,
            priceProgram: pro.price,
            userId: '',
            userName: '',
            priceType: 2,
            docIdMachine: event.keyMachine,
            date: moment(new Date(event.transactionDateandTime)).format('YYYY-MM-DD'),
            year: moment(new Date(event.transactionDateandTime)).format('YYYY'),
            month: moment(new Date(event.transactionDateandTime)).format('MM'),
            week: moment(new Date(event.transactionDateandTime)).week(),
            dayofweek: moment(new Date(event.transactionDateandTime)).day(),
            day: moment(new Date(event.transactionDateandTime)).format('DD'),
            weekOfMonth: weekOfMonth(new Date(event.transactionDateandTime)),
            transactionId: event.transactionId

        }
        // await Firestore.WashingMachineAddLog(log)

    }
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
            item.push(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {moment(new Date(res.transactionDateandTime)).format(
                            'DD-MM-YYYY HH:mm:ss'
                        )}
                    </td>
                    <td>{res.transactionId}</td>
                    <td>{res.billPaymentRef1}</td>
                    <td>{res.billPaymentRef2}</td>
                    <td>{res.payerName}</td>
                    <td>{res.nameUser}</td>
                    <td className="text-end">{res.amount}</td>
                </tr>
            )
        })
        return item
    }
    const onReport = () => { }
    return (
        <>
            <Row className="justify-content-end">
                <Col className="py-2  text-end" md={2} >
                    {
                        data.length ?
                            <Col>
                                <ExcelFile
                                    element={
                                        <Button variant='info'>
                                            <i className="fas fa-file-download"></i> {language['report_export_to_excel']}
                                        </Button>
                                    }
                                    filename="Transaction Bank report"
                                // hideElement={true}
                                >
                                    <ExcelSheet data={data} name="Transaction Bank report">
                                        <ExcelColumn label={language['report_table_1']} value={(e) => moment(new Date(e.transactionDateandTime)).format('DD-MM-YYYY HH:mm:ss')} />
                                        <ExcelColumn label={language['report_table_2']} value="transactionId" />
                                        <ExcelColumn label="Ref1" value="billPaymentRef1" />
                                        <ExcelColumn label="Ref2" value="billPaymentRef2" />
                                        <ExcelColumn label={language['global_account_name']} value="payerName" />
                                        <ExcelColumn label={language['global_username']} value="nameUser" />
                                        <ExcelColumn label={`${language['global_amount']} (${language['global_baht']})`} value="amount" />
                                    </ExcelSheet>
                                </ExcelFile>
                            </Col>
                            : null
                    }

                </Col>
            </Row>
            <Row className='justify-content-end'>
                <Col className='py-2' md={6}>
                    <Button onClick={() => setShowReport({})} variant='secondary'>
                        <i className="fas fa-chevron-left"></i> {language['global_go_back']}
                    </Button>
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_9']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_4']}
                        onChange={(e) => setTextUser(e.target.value)}
                    />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_select_8']} :</label>
                    <FormControl
                        placeholder={language['report_select_placeholder_3']}
                        onChange={(e) => setTextUserAccount(e.target.value)}
                    />
                </Col>
                <Col className='py-2 text-end' md={2}>
                    <label>{language['report_time_1']} :</label>
                    <DatePicker
                        customInput={<CustomInput />}
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                    />
                </Col>
                <Col className="py-2 text-end" md={2}>
                    <label>{language['report_time_2']} :</label>
                    <DatePicker customInput={<CustomInput2 />} selected={endDate} onChange={(date) => setEndDate(date)} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <h4>{language['report_6']} </h4>
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
                                <th className="px-2">#</th>
                                <th className="px-2">{language['report_table_1']}</th>
                                <th className="px-2">{language['report_table_2']}</th>
                                <th className="px-2">Ref1</th>
                                <th className="px-2">Ref2</th>
                                <th className="px-2">{language['global_account_name']}</th>
                                <th className="px-2">{language['global_username']}</th>
                                <th className="px-2">{`${language['global_amount']} (${language['global_baht']})`}</th>
                            </tr>
                        </thead>
                        <tbody>{renderTbody()}</tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData, permission },
        ui: { language }
    } = state
    return {
        permission,
        language
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionBankReport)
