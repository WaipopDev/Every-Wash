import React, { useEffect, useState, forwardRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row
} from 'react-bootstrap'
import moment from 'moment'

import DatePicker from "react-datepicker";
import { Database,Firestore } from '../../firebase'
import { reverseObject } from '../../utils/helpers'

import _ from 'lodash'

export const LogCustomer = (props) => {
    const { data, back, userData, language }    = props
    const [listLog, setListLog]       = useState([])
    const [lastKey, setLastKey]       = useState('')
    const [startDate, setStartDate]   = useState(new Date());
    const [endDate, setEndDate]       = useState(new Date());
    const [walletData, setWalletData] = useState([])

    useEffect(async () => {
        // const res = await Database.CustomerLogGetAll(data.uid, moment(startDate).format('YYYY-MM-DD'))
        let item = []
        const dataTime =  await Firestore.getProgramByDate(startDate,endDate)
        dataTime.forEach(element => {
          item.push({ ...element.data(), ...{ docId: element.id } })
        })
        setWalletData(item)
        if(data.wallet){
            setListLog(data.wallet)
        }
        // let val = reverseObject(res.val())
        // if (val.length) {
        //     setListLog(val)
        // }
    }, [data, startDate,endDate])

    const renderTbody = () => {
        let item = []
        let i = 1
        _.map(_.orderBy(listLog,'date','desc'), (res, index) => {
            let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
            let endTime   = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
            if(startTime <= res.date && res.date <= endTime){
            // if(moment(startDate).format('YYYY-MM-DD') === moment(res.date*1000).format('YYYY-MM-DD')){
                const resData = _.find(walletData,e=> e.transactionId == res.refWallet)
                // console.log('resData', resData)
                let branchName = ''
                let machineType = ''
                let nameProgram = ''
                let nameMachine = ''
                if(resData){
                    branchName = resData.branchName
                    machineType = resData.machineType == 1 ? language['global_wash']:language['global_dry']
                    nameProgram = resData.nameProgram
                    nameMachine = resData.nameMachine
                }else{
                    if(res.activity == 1){
                        machineType = 'เติมเงิน'
                    }
                }
                item.push(
                    <tr key={index}>
                         <td>{i}</td>
                         <td style={{width:150}}>{moment.unix(res.date).format('DD-MM-YYYY HH:mm:ss')}</td>
                         <td>{res.refWallet}</td>
                        <td>{branchName}</td>
                        <td>{machineType}</td>
                        <td>{nameMachine}</td>
                        <td>{nameProgram}</td>
                        <td>{res.amount}</td>
                    </tr>
                )
                i++
            }
        })
        return item
    }
    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                {moment(new Date(value)).format('DD-MM-YYYY')}
            </Button>
        )
    })
    return (
        <>
            <Row>
                <Col className="py-2">
                    <Button onClick={() => back()} variant="secondary"><i className="fas fa-chevron-left"></i> {language['global_go_back']}</Button>
                </Col>
                <Col className="py-2 text-end" md={3}>
                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                    <p className="m-0">ถึง</p>
                    <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{language['log_table_1']}</th>
                        <th>{language['log_table_4']}</th>
                        <th>{language['global_branch']}</th>
                        <th>{language['global_service_type']}</th>
                        <th>{language['log_table_5']}</th>
                        <th>{language['log_table_6']}</th>
                        <th>{language['global_amount']}</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTbody()}
                </tbody>
            </Table>
            {
                listLog.length === 0 &&
                <Col className="py-2">
                    <h4 className="text-center">{language['global_no_data']}</h4>
                </Col>
            }
            {
                lastKey &&
                <Col className="text-center">
                    <Button onClick={() => loadNewPage()} variant="secondary">{language['global_load_more']}</Button>
                </Col>
            }
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        },
        ui:{language}
    } = state
    return { userData,language }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LogCustomer)
