import React, { useEffect, useState, forwardRef } from 'react'
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
import { Database, Firestore } from '../src/firebase'
import { reverseObject, reponseFirestore, reponseDatabase, reponseFirestoreJson, reponseDatabaseJson } from '../src/utils/helpers'
import moment from 'moment'
import _ from 'lodash'

export const ExportDB = (props) => {
    const { userData } = props
    const [listLog, setListLog] = useState([])



    const downloadBranch = async () => {
        const res = await Firestore.dataBaseFn().collection('Branch').get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'Branch_Firestore')
    }

    const downloadCodePromotion = async () => {
        const res = await Firestore.dataBaseFn().collection('CodePromotion').get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'CodePromotion_Firestore')
    }
    const downloadLogUserAddCodePromotion = async () => {
        const res = await Firestore.dataBaseFn().collection('LogUserAddCodePromotion').get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'LogUserAddCodePromotion_Firestore')
    }
    const downloadLogWashingMachine = async () => {
        const startTime = moment('2023-09-26').unix()
        const endTime = moment('2023-09-30').unix()
        const res = await Firestore.dataBaseFn().collection('LogWashingMachine').where('createAt','>=',startTime).where('createAt','<=',endTime).get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'LogWashingMachine_Firestore')
    }
    const downloadProgramClothesDryer = async () => {
        const res = await Firestore.dataBaseFn().collection('ProgramClothesDryer').get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'ProgramClothesDryer_Firestore')
    }
    const downloadProgramWashingMachine = async () => {
        const res = await Firestore.dataBaseFn().collection('ProgramWashingMachine').get()
        const data = reponseFirestoreJson(res)
        exportData(data, 'ProgramWashingMachine_Firestore')
    }

    const downloadDashboard = async () => {
        const res = await Database.dataBaseFn().ref('Dashboard').once('value')
        exportData(res.val(), 'Dashboard_Realtime')
    }
    
    const downloadPaymentCallback = async () => {
        const res = await Database.dataBaseFn().ref('PaymentCallback').once('value')
        exportData(res.val(), 'PaymentCallback_Realtime')
    }
    const downloadAdminForce = async () => {
        const res = await Database.dataBaseFn().ref('AdminForce').once('value')
        exportData(res.val(), 'AdminForce_Realtime')
    }
    const downloadAdminLog = async () => {
        const res = await Database.dataBaseFn().ref('AdminLog').once('value')
        exportData(res.val(), 'AdminLog_Realtime')
    }
    const downloadPoint = async () => {
        const res = await Database.dataBaseFn().ref('Point').once('value')
        exportData(res.val(), 'Point_Realtime')
    }
    const downloadPointAndRedemtion = async () => {
        const res = await Database.dataBaseFn().ref('PointAndRedemtion').once('value')
        exportData(res.val(), 'PointAndRedemtion_Realtime')
    }
    const downloadPromotion = async () => {
        const res = await Database.dataBaseFn().ref('Promotion').once('value')
        exportData(res.val(), 'Promotion_Realtime')
    }
    const downloadUser = async () => {
        const res = await Database.dataBaseFn().ref('User').once('value')
        exportData(res.val(), 'User_Realtime')
    }
    const downloadWallet = async () => {
        const res = await Database.dataBaseFn().ref('Wallet').once('value')
        exportData(res.val(), 'Wallet_Realtime')
    }
    const downloadWalletCallback = async () => {
        const res = await Database.dataBaseFn().ref('WalletCallback').once('value')
        exportData(res.val(), 'WalletCallback_Realtime')
    }
    const downloadWashingMachine = async () => {
        const res = await Database.dataBaseFn().ref('WashingMachine').once('value')
        exportData(res.val(), 'WashingMachine_Realtime')
    }
    

    const exportData = (data, name_file) => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `${name_file}.json`;

        link.click();
    };


    return (
        <BasePage>
            <Container fluid>
                <Col className="py-2" >
                    <h2>Export DB</h2>
                </Col>
                <LayoutDownload name="Branch" onClick={() => downloadBranch()} />
                <LayoutDownload name="CodePromotion" onClick={() => downloadCodePromotion()} />
                <LayoutDownload name="LogUserAddCodePromotion" onClick={() => downloadLogUserAddCodePromotion()} />
                <LayoutDownload name="LogWashingMachine" onClick={() => downloadLogWashingMachine()} />
                <LayoutDownload name="ProgramClothesDryer" onClick={() => downloadProgramClothesDryer()} />
                <LayoutDownload name="ProgramWashingMachine" onClick={() => downloadProgramWashingMachine()} />

                <LayoutDownload name="Dashboard" onClick={() => downloadDashboard()} />
                <LayoutDownload name="PaymentCallback" onClick={() => downloadPaymentCallback()} />
                {/* <LayoutDownload name="AdminForce" onClick={() => downloadAdminForce()} />
                <LayoutDownload name="AdminLog" onClick={() => downloadAdminLog()} />
                <LayoutDownload name="PaymentCallback" onClick={() => downloadPaymentCallback()} /> */}
                 {/* <LayoutDownload name="Point" onClick={() => downloadPoint()} /> */}
                 <LayoutDownload name="PointAndRedemtion" onClick={() => downloadPointAndRedemtion()} />
                 <LayoutDownload name="Promotion" onClick={() => downloadPromotion()} />
                 <LayoutDownload name="User" onClick={() => downloadUser()} />
                 <LayoutDownload name="Wallet" onClick={() => downloadWallet()} />
                 <LayoutDownload name="WalletCallback" onClick={() => downloadWalletCallback()} />
                 <LayoutDownload name="WashingMachine" onClick={() => downloadWashingMachine()} />
            </Container>

        </BasePage>
    )
}

const LayoutDownload = ({ name, onClick }) => {
    return (
        <Col className="py-2 d-flex" >
            <Col className="py-2" md={4} >
                <h3>{name}</h3>
            </Col>
            <Col className="py-2" >
                <Button onClick={() => onClick()}>Download</Button>
            </Col>
        </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExportDB)
