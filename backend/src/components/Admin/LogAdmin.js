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
import { Database } from '../../firebase'
import { reverseObject } from '../../utils/helpers'

import _ from 'lodash'
export const LogAdmin = (props) => {
    const { data, back, userData, language } = props
    const [listLog, setListLog] = useState([])
    const [lastKey, setLastKey] = useState('')
    const [startDate, setStartDate] = useState(new Date());

    const fetchDataLog = async () => {
        const res = await Database.AdminLogGet(data.docId, moment(startDate).format('YYYY-MM-DD'))
   
        let val = reverseObject(res.val())
        if (val.length) {
            setLastKey(val[val.length - 1].docId)
            val.splice(-1)
            setListLog(val)
        }
    }

    useEffect(() => {
        fetchDataLog()
    }, [data, startDate])

    const loadNewPage = async () => {
        const res = await Database.AdminLogLoadGet(data.docId, moment(startDate).format('YYYY-MM-DD'), lastKey)
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
                    <td>{moment.unix(res.date).format('DD-MM-YYYY HH:mm:ss')}</td>
                    <td>{res.menu}</td>
                    <td>{res.activity}</td>
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
                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{language['log_table_1']}</th>
                        <th>{language['log_table_2']}</th>
                        <th>{language['log_table_3']}</th>
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
        ui:{
            language
        }
    } = state
    return { userData, language }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LogAdmin)
