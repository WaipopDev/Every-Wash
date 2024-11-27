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
import { reverseObject,reponseFirestore,reponseDatabase } from '../src/utils/helpers'
import moment from 'moment'
import _ from 'lodash'
export const LogBank = (props) => {
    const { userData }          = props
    const [listLog, setListLog] = useState([])
    const [dateDefault, setDateDefault] = useState(new Date());
    useEffect(() => {
        // GetLogMachineIOTAll()
        getLogMachineIOTAll()
    }, [dateDefault])

    const getLogMachineIOTAll = async () =>{
        console.log('dateDefault', )
      const res =  await Database.GetDataTransaction(moment(dateDefault).format('YYYY-MM-DD'))
       const data = reponseDatabase(res)
       console.log('data', data)
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
                         <td style={{width:150}}>{moment(res.transactionDateandTime).format('DD-MM-YYYY HH:mm:ss')}</td>
                         <td>{res.billPaymentRef1}</td>
                        <td>{res.billPaymentRef2}</td>
                        <td>{res.payerAccountName}</td>
                        <td>{res.amount}</td>
                        <td>{res.transactionId}</td>
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
                            <th>Ref1</th>
                            <th>Ref2</th>
                            <th>Account Name</th>
                            <th>Amount</th>
                            <th>Transaction Id</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(LogBank)
