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
import { reverseObject, reponseFirestore, reponseDatabase } from '../src/utils/helpers'
import moment from 'moment'
import _ from 'lodash'

export const ImportDB = (props) => {
    const { userData } = props
    const [statusBranch, setStatusBranch] = useState(false)
    const [statusCodePromotion, setStatusCodePromotion] = useState(false)
    const [statusCodeLogUserAddCodePromotion, setStatusCodeLogUserAddCodePromotion] = useState(false)
    const [statusLogWashingMachine, setStatusLogWashingMachine] = useState(false)
    const [statusProgramClothesDryer, setStatusProgramClothesDryer] = useState(false)
    const [statusProgramWashingMachine, setStatusProgramWashingMachine] = useState(false)

    const [statusPaymentCallback, setStatusPaymentCallback] = useState(false)
    const [statusDashboard, setStatusDashboard] = useState(false)
    const [statusPointAndRedemtion, setStatusPointAndRedemtion] = useState(false)
    const [statusPromotion, setStatusPromotion] = useState(false)
    const [statusUser, setStatusUser] = useState(false)
    const [statusWallet, setStatusWallet] = useState(false)
    const [statusWalletCallback, setStatusWalletCallback] = useState(false)
    const [statusWashingMachine, setStatusWashingMachine] = useState(false)




    const handleChangeBranch = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('Branch').doc(key).set(element)
            }
        }
        setStatusBranch(true)
    }
    const handleChangeCodePromotion = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('CodePromotion').doc(key).set(element)
            }
        }
        setStatusCodePromotion(true)
    }
    const handleChangeCodeLogUserAddCodePromotion = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('LogUserAddCodePromotion').doc(key).set(element)
            }
        }
        setStatusCodeLogUserAddCodePromotion(true)
    }
    const handleChangeLogWashingMachine = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('LogWashingMachine').doc(key).set(element)
            }
        }
        setStatusLogWashingMachine(true)
    }
    
    const handleChangeProgramClothesDryer = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('ProgramClothesDryer').doc(key).set(element)
            }
        }
        setStatusProgramClothesDryer(true)
    }

    
    const handleChangeProgramWashingMachine = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Firestore.dataBaseFn().collection('ProgramWashingMachine').doc(key).set(element)
            }
        }
        setStatusProgramWashingMachine(true)
    }

    const handleChangePaymentCallback = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Database.dataBaseFn().ref(`/PaymentCallback/${key}`).set(element)
            }
        }
        setStatusPaymentCallback(true)
    }

    const handleChangeDashboard = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Database.dataBaseFn().ref(`/Dashboard/${key}`).set(element)
            }
        }
        setStatusDashboard(true)
    }

    const handleChangePointAndRedemtion = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                await Database.dataBaseFn().ref(`/PointAndRedemtion/${key}`).set(element)
            }
        }
        setStatusPointAndRedemtion(true)
    }

    const handleChangeWashingMachine = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                await Database.dataBaseFn().ref(`/WashingMachine/${key}`).set(element)
            }
        }
        setStatusWashingMachine(true)
    }

    const handleChangePromotion = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                await Database.dataBaseFn().ref(`/Promotion/${key}`).set(element)
            }
        }
        setStatusPromotion(true)
        
    }

    const handleChangeUser = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                await Database.dataBaseFn().ref(`/User/${key}`).set(element)
            }
        }
        setStatusUser(true)
    }

    const handleChangeWallet = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                await Database.dataBaseFn().ref(`/Wallet/${key}`).set(element)
            }
        }
        setStatusWallet(true)
    }

    const handleChangeWalletCallback = async (e) => {
        const data = await readFile(e)
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                await Database.dataBaseFn().ref(`/WalletCallback/${key}`).set(element)
            }
        }
        setStatusWalletCallback(true)
    }

    const readFile = (e) => {
        return new Promise((resolve, reject) => {
            const file = e.target.files[0];
            if (file) {
                const fileReader = new FileReader();
                fileReader.readAsText(file, "UTF-8");
                fileReader.onload = (e) => {
                    resolve(JSON.parse(e.target.result))
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            } else {
                reject(new Error('No file selected.'))
            }
        })
    }

    return (
        <BasePage>
            <Container fluid>
                <Col className="py-2" >
                    <h2>Import DB</h2>
                </Col>
                <LayoutImport name="Branch" onChange={handleChangeBranch} status={statusBranch} />
                <LayoutImport name="CodePromotion" onChange={handleChangeCodePromotion} status={statusCodePromotion} />
                <LayoutImport name="LogUserAddCodePromotion" onChange={handleChangeCodeLogUserAddCodePromotion} status={statusCodeLogUserAddCodePromotion} />
                <LayoutImport name="LogWashingMachine" onChange={handleChangeLogWashingMachine} status={statusLogWashingMachine} />
                <LayoutImport name="ProgramClothesDryer" onChange={handleChangeProgramClothesDryer} status={statusProgramClothesDryer} />
                <LayoutImport name="ProgramWashingMachine" onChange={handleChangeProgramWashingMachine} status={statusProgramWashingMachine} />

                <LayoutImport name="Dashboard" onChange={handleChangeDashboard} status={statusDashboard} />
                <LayoutImport name="PaymentCallback" onChange={handleChangePaymentCallback} status={statusPaymentCallback} />
                <LayoutImport name="PointAndRedemtion" onChange={handleChangePointAndRedemtion} status={statusPointAndRedemtion} />
                <LayoutImport name="Promotion" onChange={handleChangePromotion} status={statusPromotion} />
                <LayoutImport name="User" onChange={handleChangeUser} status={statusUser} />
                <LayoutImport name="Wallet" onChange={handleChangeWallet} status={statusWallet} />
                <LayoutImport name="WalletCallback" onChange={handleChangeWalletCallback} status={statusWalletCallback} />
                <LayoutImport name="WashingMachine" onChange={handleChangeWashingMachine} status={statusWashingMachine} />

            </Container>

        </BasePage>
    )
}

const LayoutImport = ({ name, onChange, status }) => {
    return (
        <Col className="py-2 d-flex" >
            <Col className="py-2" md={4} >
                <h3>{name}</h3>
            </Col>
            <Col className="py-2" >
                <input type="file" onChange={(e) => onChange(e)} />
            </Col>
            <Col className="py-2" >
                { status ? <p>Success</p> : <p>-</p>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ImportDB)
