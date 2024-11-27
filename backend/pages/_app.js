import React, { useEffect } from 'react'
import ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import Router from "next/router";
import App from "next/app";
import moment from 'moment'
import { Auth, Database, Firestore } from '../src/firebase'
import store from '../src/redux/store'
import PageChange from "../src/components/PageChange";
import LoadPage from "../src/components/PageChange/LoadPage";
import * as types from "../src/redux/types";
import Alert from "../src/components/Modal/Alert";

import { redirectUser, AddLogAdmin, reponseDatabase, reponseFirestore } from '../src/utils/helpers'
import _ from 'lodash'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
import 'styles/main.scss';


Router.events.on("routeChangeStart", (url) => {
    console.log(`Loading: ${url}`);
    document.body.classList.add("body-page-transition");
    ReactDOM.render(
        <PageChange path={url} />,
        document.getElementById("page-transition")
    );
});
Router.events.on("routeChangeComplete", () => {
    console.log(`routeChangeComplete`)
    ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
    document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
    console.log(`routeChangeError`)
    ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
    document.body.classList.remove("body-page-transition");
});


class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }
    state = {
        isAuth: null,
        showAlert:false,
        message:''
    }


    getLangList = async () => {
        const langList = await Database.GetListLanguage()
        store.dispatch({
            type: types.SET_LANGUAGE_LIST,
            value: langList.val()
        })
    }

    getLangActive = async () => {
        let langActive = localStorage.getItem('lang')
        if(!langActive){
            localStorage.setItem('lang', 'TH')
            langActive = 'TH'
        }
        const langListActive = await Database.GetDetailLanguage(langActive)
        store.dispatch({
            type: types.SET_LANGUAGE,
            value: langListActive.val()
        })
    }

    componentDidMount() {
        const _this = this
        // Auth.signOut()
        this.getLangList()
        this.getLangActive()
        Auth.onAuthStateChanged(async (user) => {
            try {
                if (user) {
                    let checkOldMail = false
                  const resAdminForceGet =  await Database.AdminForceGet()
                  if(_.indexOf( _.values(resAdminForceGet.val()),user.email) >= 0){
                    checkOldMail = true
                  }
                    if(user.emailVerified || checkOldMail){
       
                        const param = {
                            lastLogin: moment().unix(),
                            token: user.refreshToken
                        }
                        const snapshot = await Firestore.AdminGet(user.uid)
                        snapshot.forEach(async doc => {
                            if (doc.data().status === 1) {
                                await Firestore.AdminUpdate(doc.id, param)
                                store.dispatch({
                                    type: types.USER_SET_DATA,
                                    value: { ...doc.data(), ...{ id: doc.id } }
                                })
                                AddLogAdmin({ id: doc.id }, 'Login', '')
                                if (doc.data().type > 1) {
                                    const snapshotPermission = await Database.AdminPermissionGet(doc.data().uid)
                                    store.dispatch({
                                        type: types.USER_SET_PERMISSION,
                                        value: snapshotPermission.val()
                                    })
                                }
                                _this.setState({ isAuth: true })
                            } else {
                                await Auth.signOut()
                                _this.setState({ isAuth: false }, () => redirectUser("/signin"))
                            }
                        });
                    }else{
                        const resEmail = await Firestore.AdminVerifyAccountByEmail(user.email)
                        const data = reponseFirestore(resEmail)
                        if(!data[0]?.password){
                            await Auth.signOut()
                            _this.setState({ showAlert: true,message:'อีเมล นี้ยังไม่ได้ทำการยืนยันตัวตน' })
                        }
                        // store.dispatch({
                        //     type: types.USER_SET_DATA,
                        //     value: {error:'User นี้ยังไม่ได้ทำการยืนยัน E-mail'}
                        // })
                        // _this.setState({ isAuth: false }, () => redirectUser("/signin"))
                    }
                } else {
                    if(this.props.router.route === '/check_mail_verify'){
                        store.dispatch({
                            type: types.USER_SET_DATA,
                            value: {}
                        })
                        _this.setState({ isAuth: false }, () => redirectUser("/check_mail_verify"))
                    }else{
                        store.dispatch({
                            type: types.USER_SET_DATA,
                            value: {}
                        })
                        _this.setState({ isAuth: false }, () => redirectUser("/signin"))
                    }
                }
            } catch (error) {
                console.log(`error`, error)
            }
        })

    }

    handleAlertClose(){
        this.setState({showAlert:false})
    }

    render() {
        const { Component, pageProps, router } = this.props;
        const { isAuth,showAlert, message } = this.state
        let renderItem = <Component {...pageProps} />
        if (isAuth) {
            if (router.route === '/signin') {
                renderItem = null
                redirectUser("/dashboard")
            }
        } else {
            if (router.route !== '/signin' && router.route !== '/check_mail_verify') {
                renderItem = null
            }
        }
        return (
            <React.StrictMode>
                <Provider store={store}>
                    <Modal show={showAlert} onHide={()=> this.handleAlertClose()}>
                        <Modal.Header closeButton>
                            <Modal.Title>แจ้งเตือน</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{message}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=> this.handleAlertClose()}>
                                {`ปิด`}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Alert/>
                    {
                        _.isNull(isAuth) ?
                            <LoadPage />
                            :
                            renderItem
                    }
                </Provider>
            </React.StrictMode>

        )
    }
}

export default MyApp