import React, { useState, useEffect } from "react";
import { Auth } from "../src/firebase"
import {
    Container,
    Row,
    Col
} from "react-bootstrap";
import Image from "next/image"
import Link from "next/link";
import axios from "axios";

const CheckMailVerify = (props) => {
    const { } = props
    const [isVerified, setIsVerified] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        setEmail(email)
        handleSendWelcome(email)
    }, []);

    const handleSendWelcome = async (emails) => {
        try {
            if(emails){
                console.log("🚀 ~ file: check_mail_verify.js:25 ~ handleSendWelcome ~ emails:", emails)
                await axios.post(`${process.env.sendMail}/send-welcome-email`, {
                    "userEmail": emails,
                    "redirectUrl": `https://${window.location.host}`
                })
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleCheckVerification = () => {

        Auth.fetchSignInMethodsForEmail(email).then((methods) => {
            console.log("🚀 ~ file: check_mail_verify.js:22 ~ Auth.fetchSignInMethodsForEmail ~ methods:", methods)
            const isEmailVerified = methods.includes("password");
            console.log("🚀 ~ file: check_mail_verify.js:21 ~ auth ~ isEmailVerified:", isEmailVerified)
            setIsVerified(isEmailVerified);
            //   if (!isEmailVerified) {
            //     alert("Please verify your email to continue.");
            //     auth().currentUser.sendEmailVerification();
            //   }
        });
    };


    return (
        <Container className="p-5">
            <Row>
                <Col md={4}>
                    <Image alt={'logo'} className="navbar-brand-img" src={require('../public/img/theme/logo_web.png')} />
                </Col>
            </Row>
            <Row>
                <div className="card-content-center" style={{paddingTop:50}}>
                    <Col>
                    <i className="far fa-check-circle icon-check-suceess"></i>
                    </Col>
                    <Col><h1>{'ยืนยันอีเมลสำเร็จ'}</h1></Col>
                    <Col><p>{`ขณะนี้อีเมล `}<span style={{ color: '#4ba0d2' }}>{email}</span>{` ได้รับการยืนยันแล้ว`}</p></Col>
                    <Col className="text-center">
                        <Link href={'/signin'} >
                            <div className="btn-page-mail"> 
                                <span style={{ color: 'white' }}>ไปหน้าเข้าสู่ระบบ</span>
                            </div>
                        </Link>
                    </Col>
                </div>
            </Row>
        </Container>
    );
};

export default CheckMailVerify;
