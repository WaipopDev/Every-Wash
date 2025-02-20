import React, { useEffect,useState,forwardRef } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import {
    Col,
    Button,
    Table,
    Row,
    Container
} from 'react-bootstrap'
import DatePicker from "react-datepicker";
import { Database,Firestore } from '../src/firebase'
import { reverseObject,reponseFirestore } from '../src/utils/helpers'
import moment from 'moment'
import _ from 'lodash'
export const LogIOT = (props) => {
    const { userData }          = props
    const [listLog, setListLog] = useState([])
    const [dateDefault, setDateDefault] = useState(new Date());
    useEffect(() => {
        // GetLogMachineIOTAll()
        getLogMachineIOTAll()
    }, [dateDefault])

    const getLogMachineIOTAll = async () =>{
      const res =  await Firestore.GetLogMachineIOTAll(dateDefault)
       const data = reponseFirestore(res)
       if(data){
        setListLog(_.orderBy(data,'createAt','desc'))
       }
    }
    const renderTbody = () => {
        let item = []
        let i = 1
        _.map(listLog, (res, index) => {
                item.push(
                    <tr key={index}>
                         <td>{i}</td>
                         <td style={{width:150}}>{moment.unix(res.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                         <td>{res.idMachine}</td>
                        <td>{res.deviceID}</td>
                        <td>{res.timeStamp}</td>
                        <td>{res.serviceID}</td>
                        <td>{res.eventID}</td>
                    </tr>
                )
                i++
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
        <BasePage>
       <Container fluid>
            <Col className="py-2" >
                <DatePicker customInput={<CustomInput />} selected={dateDefault} onChange={(date) => setDateDefault(date)} />
            </Col>
             <Col className="py-2" >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>วัน เวลา</th>
                            <th>idMachine</th>
                            <th>deviceID</th>
                            <th>timeStamp</th>
                            <th>serviceID</th>
                            <th>eventID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTbody()}
                    </tbody>
                </Table>
            </Col>
       </Container>
            
        </BasePage>
    )
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        }
    } = state
    return { userData }
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIOT)
