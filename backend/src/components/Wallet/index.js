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

export const Wallet = (props) => {
    let { wallet, getWalletAll, getWalletFilter, language } = props
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
            getWalletFilter(startDateFormat, '', firstName)
          const dataTime =  await Firestore.getProgramByDate(startDate,endDate)
          dataTime.forEach(element => {
              if(element.data().transactionId){
                  item.push({ ...element.data(), ...{ docId: element.id } })
              }
          })
          setWalletData(item)
         
    }, [startDate,endDate, firstName])

    useEffect( () => {
        let item = []
       
       _.map(_.orderBy(wallet,'date','desc'),(res, index) => {
            // let startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime() / 1000
            // let endTime   = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0).getTime() / 1000
            let startTime = moment(`${moment(startDate).format('YYYY-MM-DD')} 00:00:00`).unix()
            let endTime   = moment(`${moment(endDate).format('YYYY-MM-DD')} 23:59:59`).unix()
            if(startTime <= res.date && res.date <= endTime){
             
                let textChannel = ''
                let codeText = ''
                let textProgram = ''
                if(!_.isUndefined(res.dataCode)){
                    textChannel = label['global_code_promotion']
                    codeText = res.dataCode.code
                }else if(res.adminBy){
                    if(res.adminBy == 'System'){
                        textChannel = language['global_system']
                    }else{
                        textChannel = language['global_admin']
                    }
                   
                }else{
                    if(res.activity == 1){
                        textChannel = language['global_promtpay']
                    }else{
                        textChannel = language['global_member_card']
                    }
                } 
    
                const resData = _.find(walletData,e=> e.transactionId == res.refWallet)
                if(resData){
                    textProgram = resData.nameProgram
                }

                if(!activity){
                    item.push({...res,...{textProgram,textChannel,codeText}})
                }else if(activity == 1 && res.activity == 1){
                    item.push({...res,...{textProgram,textChannel,codeText}})
                }else if(activity == 2 && res.activity == 2 && _.isUndefined(res.dataCode)){
                    item.push({...res,...{textProgram,textChannel,codeText}})
                }else if(activity == 3 && res.activity == 2 && !_.isUndefined(res.dataCode)){
                    item.push({...res,...{textProgram,textChannel,codeText}})
                }
                
            }
        })
  
                setDataWalletSort(item)
    }, [wallet,walletData,activity])

    const CustomInput = forwardRef((props, ref) => {
        const { onClick, value } = props
        return (
            <>
              
                <Button onClick={onClick}>
                <i className="fas fa-calendar-day"></i> {moment(new Date(value)).format('DD-MM-YYYY')}
                </Button>
            </>
        )
    })
    const setDataRander = (index,res,i) =>{
        return (
            <tr key={index}>
                <td className="px-1">{i}</td>
                <td className="px-1">{moment(res.date * 1000).format('DD-MM-YYYY HH:mm:ss')}</td>
                <td className="px-1">{res.refWallet}</td>
                <td className="px-1">{`${res.firstName}`}</td>
                <td className="px-1">{res.textProgram}</td>
                <td className="px-1">{res.textChannel}</td>
                <td className="px-1">{res.activity == 1 ? language['member_card_title_1'] : language['member_card_title_2']}</td>
                <td className="px-1">{res.amount}</td>
                <td className="px-1">{res.remarks ? res.remarks : res.codeText}</td>
            </tr>
        )
    }
    const renderTbody = () => {
        let item = []
        let i = 1
        dataWalletSort.map((res, index) => {
            item.push(setDataRander(index,res,i))
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
                                    <h4>{language['member_card_management']}</h4>
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
                                                    <i className="fas fa-file-download"></i> {language['report_export_to_excel']}
                                                </Button>
                                            }
                                            filename="wallet report"
                                        // hideElement={true}
                                        >
                                            <ExcelSheet data={dataWalletSort} name="wallet report">
                                                <ExcelColumn label={language['report_table_1']}  value={(e)=>moment(e.date * 1000).format('DD-MM-YYYY HH:mm:ss')}  />
                                                <ExcelColumn label={language['member_card_title_3']} value="refWallet" />
                                                <ExcelColumn label={language['customer_title_8']} value="firstName" />
                                                <ExcelColumn label={language['member_card_title_4']} value="textProgram" />
                                                <ExcelColumn label={language['member_card_title_5']} value="textChannel" />
                                                <ExcelColumn label={language['log_table_3']} value={(e)=>e.activity == 1 ? language['member_card_title_1'] : language['member_card_title_2']} />
                                                <ExcelColumn label={language['global_amount']} value="amount" />
                                                <ExcelColumn label={language['member_card_title_6']} value={(e)=> e.adminBy ? e.remarks : e.codeText } />
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
                                        <option value={''}>{language['member_card_title_7']}</option>
                                        <option value={1}>{language['member_card_title_1']}</option>
                                        <option value={2}>{language['member_card_title_2']}</option>
                                        <option value={3}>{language['global_code_promotion']}</option>
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
                                            <i className="fas fa-search"></i> {language['global_search']}
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col className="py-2 text-end" md={3}>
                                    <p>{language['report_time_1']} : </p>
                                    <DatePicker customInput={<CustomInput />} selected={startDate} onChange={(date) => setStartDate(date)} />
                                    <p className="m-0">{language['report_time_2']} : </p>
                                    <DatePicker customInput={<CustomInput />} selected={endDate} onChange={(date) => setEndDate(date)} />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="tableNoWrap">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th className="px-2">#</th>
                                            <th className="px-2">{language['report_table_1']}</th>
                                            <th className="px-2">{language['member_card_title_3']}</th>
                                            <th className="px-2">{language['customer_title_8']}</th>
                                            <th className="px-2">{language['member_card_title_4']}</th>
                                            <th className="px-2">{language['member_card_title_5']}</th>
                                            <th className="px-2">{language['log_table_3']}</th>
                                            <th className="px-2">{language['global_amount']}</th>
                                            <th className="px-2">{language['member_card_title_6']}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTbody()}
                                    </tbody>
                                </Table>
                                </Col>
                            </Row>
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
        },
        ui: { language }
    } = state
    return {
        wallet,
        language
    }
}

const mapDispatchToProps = {
    getWalletAll: WalletAction.getWalletAll,
    getWalletFilter: WalletAction.getWalletFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
