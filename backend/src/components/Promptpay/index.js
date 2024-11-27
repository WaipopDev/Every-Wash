import React, { useEffect, forwardRef, useState, createRef } from 'react'
import { connect } from 'react-redux'
import {
    Col,
    Button,
    Table,
    Row,
    Container,
    Card,
    InputGroup,
    FormControl,
    Form
} from 'react-bootstrap'
import moment from 'moment'
import ReactExport from "@ibrahimrahmani/react-export-excel";
import DatePicker from "react-datepicker";
import { Database,Firestore } from '../../firebase'
import { WalletAction } from '../../redux/actions'
import { reverseObject } from '../../utils/helpers'
import _ from 'lodash';

export const PromptpayPage = (props) => {
    let { wallet, getWalletAll, getWalletFilter } = props
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [activity, setActivity] = useState('')
    const [firstName, setFirstName] = useState('')
    const [walletData, setWalletData] = useState([])
    const [dataWalletSort, setDataWalletSort] = useState([])
    const fromRefName = createRef()

    useEffect(async () => {
        let startDateFormat = moment(startDate).format('YYYY-MM')
        let item = []
            getWalletFilter(startDateFormat, activity, firstName)
          const dataTime =  await Firestore.getProgramByDate(startDate,endDate)
          dataTime.forEach(element => {
              if(element.data().transactionId){
                  item.push({ ...element.data(), ...{ docId: element.id } })
              }
          })
          setWalletData(item)

    }, [startDate,endDate, activity, firstName])

    useEffect( () => {
        let item = []
       _.map(_.orderBy(wallet,'date','desc'),(res, index) => {
            let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
            let endTime   = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
            if(startTime <= res.date && res.date <= endTime){
             
                let textChannel = ''
                let codeText = ''
                let textProgram = ''
                if(!_.isUndefined(res.dataCode)){
                    textChannel = 'Code Promotion'
                    codeText = res.dataCode.code
                }else if(res.adminBy){
                    textChannel = 'Admin'
                }else{
                    if(res.activity == 1){
                        textChannel = 'Promptpay'
                    }else{
                        textChannel = 'E-wallet'
                    }
                } 
    
                const resData = _.find(walletData,e=> e.transactionId == res.refWallet)
                if(resData){
                    textProgram = resData.nameProgram
                }
                // return {...res,...{textProgram,textChannel,codeText}}
           
                item.push({...res,...{textProgram,textChannel,codeText}})
            }
        })
  
                setDataWalletSort(item)
    }, [wallet,walletData])

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <>
              
                <Button onClick={onClick}>
                    {moment(new Date(value)).format('DD-MM-YYYY')}
                </Button>
            </>
        )
    })

    const renderTbody = () => {
        let item = []
        let i = 1
        dataWalletSort.map((res, index) => {
     
                item.push(
                    <tr key={index}>
                        <td className="px-1">{i}</td>
                        <td className="px-1">{moment(res.date * 1000).format('DD-MM-YYYY HH:mm:ss')}</td>
                        <td className="px-1">{res.refWallet}</td>
                        <td className="px-1">{`${res.firstName}`}</td>
                        <td className="px-1">{res.textProgram}</td>
                        <td className="px-1">{res.textChannel}</td>
                        <td className="px-1">{res.activity == 1 ? 'เติมเงิน' : 'จ่ายเงิน'}</td>
                        <td className="px-1">{res.amount}</td>
                        <td className="px-1">{res.adminBy ? res.remarks : res.codeText}</td>
                    </tr>
                )
                i++
        })
        return item
    }
    return (
        <Container fluid>
            <Row className="py-md-4">
                <Col>
                    <Card className="card-stats card-dashboard shadow mb-4 mb-xl-0">
                        <Card.Header className="bg-transparent pt-3">
                            <Row>
                                <Col>
                                    <h4>Wallet Management</h4>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                        <Row className="justify-content-end">
                            <Col className="py-2  text-end" md={2} >
                                {
                                    dataWalletSort &&
                                    <Col>
                                        <ExcelFile
                                            element={
                                                <Button variant='info'>
                                                    {'Export File Excel'}
                                                </Button>
                                            }
                                            filename="wallet report"
                                        // hideElement={true}
                                        >
                                            <ExcelSheet data={dataWalletSort} name="wallet report">
                                                <ExcelColumn label="วันที่"  value={(e)=>moment(e.date * 1000).format('DD-MM-YYYY HH:mm:ss')}  />
                                                <ExcelColumn label=">หมายเลข wallet" value="refWallet" />
                                                <ExcelColumn label="ชื่อ สกุล" value="firstName" />
                                                <ExcelColumn label="Program" value="textProgram" />
                                                <ExcelColumn label="ช่องทาง" value="textChannel" />
                                                <ExcelColumn label="กิจกรรม" value={(e)=>e.activity == 1 ? 'เติมเงิน' : 'จ่ายเงิน'} />
                                                <ExcelColumn label="จำนวนเงิน" value="amount" />
                                                <ExcelColumn label="Code/เหตุผล" value={(e)=> e.adminBy ? e.remarks : e.codeText } />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    </Col>
                                }

                            </Col>
                        </Row>
                            <Row className="justify-content-end">
                                <Col className="py-2 text-end" md={2}>
                                    <Form.Select
                                        onChange={(e) => { setActivity(e.target.value) }}
                                        name={'type'}
                                    >
                                        <option value={''}>{'เลือกประเภทรายการ'}</option>
                                        <option value={1}>{'เติมเงิน'}</option>
                                        <option value={2}>{'จ่ายเงิน'}</option>
                                        <option value={3}>{'Code Promotion'}</option>
                                    </Form.Select>
                                </Col>
                                <Col className="py-2 text-end" md={3}>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="username"
                                            name={'name'}
                                            ref={fromRefName}
                                        />
                                        <Button
                                            onClick={() => { setFirstName(fromRefName.current.value) }}
                                        >
                                            ค้นหา
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col className="py-2 text-end" md={3}>
                                    <p>เลือกวันที่แสดง : </p>
                                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                                    <p className="mt-2">ถึงวันที่ : </p>
                                    <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                                </Col>
                            </Row>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="px-1">#</th>
                                        <th className="px-1">วัน เวลาที่ทำรายการ</th>
                                        <th className="px-1">หมายเลข wallet</th>
                                        <th className="px-1">ชื่อ สกุล</th>
                                        <th className="px-1">Program</th>
                                        <th className="px-1">ช่องทาง</th>
                                        <th className="px-1">กิจกรรม</th>
                                        <th className="px-1">จำนวนเงิน</th>
                                        <th className="px-1">Code/เหตุผล</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTbody()}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        wallet: {
            data: wallet
        }
    } = state
    return {
        wallet
    }
}

const mapDispatchToProps = {
    getWalletAll: WalletAction.getWalletAll,
    getWalletFilter: WalletAction.getWalletFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptpayPage)
