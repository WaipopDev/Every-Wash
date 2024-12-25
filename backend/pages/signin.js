import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Image from "next/image"
import { Auth, Firestore, Database, signInWithEmailAndPassword } from '../src/firebase'
import { redirectUser, reponseFirestore, reponseDatabase } from '../src/utils/helpers'
import {
    Container,
    Row,
    Col,
    Form,
    FormLabel,
    InputGroup,
    FormControl,
    Button,
    FormGroup,
    Alert,
    Spinner
} from 'react-bootstrap';

import Modal from '../src/components/Modal'
import _ from 'lodash'
import axios from 'axios'


export const SignIn = (props) => {
    const { userData } = props
    const [validated, setValidated] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [panding, setPanding] = useState(false);
    const [isActive, setIsActive] = useState({ dataAvtive: {}, listItem: [] })
    const [configModal, setConfigModal] = useState({
        title: '',
        errorMsg: '',
        pending: false
    })
    useEffect(() => {
        if (!_.isUndefined(userData.uid)) {
            redirectUser('/dashboard')
        }
    }, [userData])
    const login = async (mail, pass) => {
        try {
            setPanding(true)
            await signInWithEmailAndPassword(Auth, mail, pass)
            setPanding(false)
            redirectUser('/dashboard')
        } catch (error) {
            console.log("🚀 ~ login ~ error:", error)
            setMessageError(error.message)
            setPanding(false)
        }
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (messageError) {
            setMessageError('')
        }
        if (form.checkValidity() === false) {
            setValidated(true);
            event.preventDefault();
            event.stopPropagation();
        } else {
            const email = form['email'].value
            const password = form['password'].value
            login(email, password)
        }
        event.preventDefault();
        event.stopPropagation();
    }
    const onVerify = () => {
        const param = [
            {
                label: 'Email',
                name: 'email',
                type: 'email',
                required: true
            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                required: true
            },
        ]
        setConfigModal((oldData) => ({
            ...oldData,
            title: 'Verify Identity Account',
            successMsg: '',
            errorMsg: '',
            pending: false
        }))
        setIsActive({ dataAvtive: {}, listItem: param })
    }
    const handleSubmitVerify = async (form) => {
        try {
            setConfigModal((oldData) => ({
                ...oldData,
                errorMsg: '',
                pending: true
            }))
            const email = form['email'].value
            const password = form['password'].value
            const resEmail = await Firestore.AdminVerifyAccount(email, password)
            const data = reponseFirestore(resEmail)

            if (data.length) {
                const dataItem = data[0]

                const response = await Auth.createUserWithEmailAndPassword(email, password)

                // const user = response.user;
                // console.log("🚀 ~ file: signin.js:109 ~ handleSubmitVerify ~ user:", user)
                // await user.sendEmailVerification()
                // setTimeout(async ()=>{
                await axios.post(`${process.env.sendMail}/send-verification-email`, {
                    "userEmail": response.user.email,
                    "redirectUrl": `https://${window.location.host}/check_mail_verify?email=${response.user.email}`
                })
                const resAdminPermission = await Database.AdminPermissionGet(dataItem.uid)

                await Database.AdminPermissionSet(response.user.uid, resAdminPermission.val())
                await Database.AdminPermissionDelete(dataItem.uid)
                const param = {
                    password: null,
                    uid: response.user.uid
                }
                await Firestore.AdminUpdate(dataItem.docId, param)
                await Auth.signOut()
                setConfigModal((oldData) => ({
                    ...oldData,
                    successMsg: 'ทำรายการสำเร็จ โปรดยืนยันอีเมลเพื่อทำการ เข้าใช้ระบบ',
                    // errorMsg:'',
                    pending: false
                }))
                // },1000)
            } else {
                setConfigModal((oldData) => ({
                    ...oldData,
                    errorMsg: `ไม่มีรายการนี้`,
                    // successMsg:'',
                    pending: false
                }))
            }
        } catch (error) {
            setConfigModal((oldData) => ({
                ...oldData,
                errorMsg: 'Error',
                // successMsg:'',
                pending: false
            }))
            console.log(`error`, error)
        }
    }

    return (
        <Container className="signin">
            <Row className="justify-content-md-center">
                <Image alt={'logo'} className="navbar-brand-img" src={require('../public/img/brand/Every-Wash-Logo.png')} width={250} />
            </Row>
            <Row className="justify-content-md-center text-center py-4">
                <Col>
                    <h2 className="font-weight-bold">Sign in</h2>
                    <p className="m-0">Sign in to continue to Ever Wash</p>
                </Col>
            </Row>
            <Row>
                {
                    messageError &&
                    <Alert variant={'danger'}>
                        {messageError}
                    </Alert>
                }
            </Row>
            <Row>
                <Col>
                    <Form className="form-signin" validated={validated} onSubmit={(e) => handleSubmit(e)} noValidate>

                        <FormGroup className="mb-3">
                            <FormLabel htmlFor="signin-email" className="pb-2 font-weight-bold">Username</FormLabel>
                            <InputGroup>
                                <InputGroup.Text><i className="fas fa-user"></i></InputGroup.Text>
                                <FormControl type="email" name="email" id="signin-email" placeholder="email" required />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel htmlFor="signin-password" className="pb-2 font-weight-bold lable-forgot">Password</FormLabel>
                            <InputGroup>
                                <InputGroup.Text><i className="fas fa-unlock-alt"></i></InputGroup.Text>
                                <FormControl type="password" name="password" id="signin-password" placeholder="password" required />
                            </InputGroup>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            {/* <Form.Check label="Remember me" /> */}
                        </FormGroup>
                        <FormGroup>
                            <Button type="submit" color="primary" className="w-100">
                                {panding ? <Spinner animation="border" variant="light" /> : 'Sign in'}
                            </Button>
                        </FormGroup>
                    </Form>
                    <Button variant="link" className="p-0 mt-2" onClick={() => onVerify()}>Verify Identity Account</Button>
                </Col>

            </Row>
            <Modal item={isActive.listItem} configModal={configModal} submit={(e) => handleSubmitVerify(e)} />
        </Container>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData }
    } = state
    return {
        userData
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
