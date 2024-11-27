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
import { Database, Firestore } from '../../firebase'
import { reverseObject, reponseFirestore, startDate, endDate } from '../../utils/helpers'

import _ from 'lodash'
export const LogIOT = (props) => {
    const { data, back, userData, language } = props
    const [listLog, setListLog] = useState([])
    const [lastKey, setLastKey] = useState('')
    const [defaultDate, setDefaultDateDate] = useState(new Date());
    useEffect(async () => {
        const res = await Firestore.LogIOTGet(data.id, data.idIOT,moment(startDate(defaultDate)).unix(), moment(endDate(defaultDate)).unix())
        // const res2 = await Firestore.LogIOTGetLast(data.id, data.idIOT, moment(startDate(defaultDate)).unix(), moment(endDate(defaultDate)).unix())
        // console.log(`res2`, reponseFirestore(res2))
        let dataRes = reponseFirestore(res)
        // if (dataRes.length) {
            // setLastKey(dataRes[dataRes.length - 1].docId)
            // dataRes.splice(-1)
            setListLog(dataRes)
        // }
        // console.log(`data`, dataRes)
    }, [data, defaultDate])
    const loadNewPage = async () => {
        const res = await Firestore.LogMachineGet(data.docId, moment(defaultDate).format('YYYY-MM-DD'), lastKey)
        let val = reverseObject(res.val())
        if (lastKey !== val[val.length - 1].docId) {
            if (val.length < 11) {
                setListLog([...listLog, ...val])
                setLastKey('')
            } else {
                setLastKey(val[val.length - 1].docId)
                val.splice(-1)
                setListLog([...listLog, ...val])
            }
        } else {
            setLastKey('')
        }
    }
    const renderTbody = () => {
        let item = []
        _.map(listLog, (res, index) => {
            item.push(
                <tr key={index}>
                    <td>{moment.unix(res.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td>{res.id}</td>
                    <td>{res.idIOT}</td>
                    <td>
                        {res.status === 1 && language['global_ready_to_use']}
                        {res.status === 2 && language['global_working']}
                        {/* {res.status === 1 && "เชื่อมต่อ"} */}
                    </td>
                    <td>{Number(res.machineType) === 1 ? language['global_machine_name'] : language['global_program_name']}</td>
                </tr>
            )
        })
        return item
    }
    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
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
                    <DatePicker customInput={<CustomInput />} selected={defaultDate} onChange={(date) => setDefaultDateDate(date)} />
                </Col>
            </Row>
            <Col className="tableNoWrap">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{language['log_table_1']}</th>
                        <th>{language['washing_machine_title_2']}</th>
                        <th>{language['washing_machine_title_3']}</th>
                        <th>{language['global_status']}</th>
                        <th>{language['washing_machine_title_1']}</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTbody()}
                </tbody>
            </Table>
            </Col>
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
        ui: {language }
    } = state
    return { userData, language }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LogIOT)
