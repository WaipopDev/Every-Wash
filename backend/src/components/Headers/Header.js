import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Link from "next/link";
import { Auth, Database } from '../../firebase'
import { Ui } from '../../redux/actions'

import {
    Nav,
    Navbar,
    Container,
    Dropdown
} from 'react-bootstrap'
import { AddLogAdmin } from '../../utils/helpers'
import _ from 'lodash'

export const Header = (props) => {
    const { brandText, userData, languageList, setLanguage: setLanguageProps, language: languageShow } = props
    const [language, setLanguage] = useState('')

    useEffect(() => {
        const lang = localStorage.getItem('lang')
        setLanguage(lang)
    }, [])

    const handleSetLang = async (lang) => {
        localStorage.setItem('lang', lang)
        setLanguage(lang)
        const res = await Database.GetDetailLanguage(lang)
        setLanguageProps(res.val())
    }

    const logOut = async (event) => {
        try {

            AddLogAdmin(userData, 'Logout', '')
            await Auth.signOut()
            event.preventDefault();
            event.stopPropagation();
        } catch (error) {
            console.log(`error`, error)
            event.preventDefault();
            event.stopPropagation();
        }
    }
    return (
        <>
            <Navbar className="navbar-top navbar-dark nav-custom" expand="md">
                <Container fluid>
                    <p className="m-0 text-white">
                        {languageShow[brandText] || ''}
                    </p>

                    <Nav className="d-none d-md-flex" navbar>
                        <Dropdown align="end" className="d-inline mx-2">
                            <Dropdown.Toggle id="dropdown-autoclose-true">
                                {language}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    _.map(languageList,(item, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => handleSetLang(item)}>
                                                {item}
                                            </Dropdown.Item>
                                        )
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown align="end" className="d-inline mx-2">
                            <Dropdown.Toggle id="dropdown-autoclose-true">
                                <i className="fas fa-user-circle"></i> {userData.name}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Header>
                                    <h6 className="text-overflow m-0">ยินดีต้อนรับ!</h6>
                                </Dropdown.Header>
                                <Link href="/admin/profile">
                                    <Dropdown.Item href="/admin/profile">
                                        <span>My Profile</span>
                                    </Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#" onClick={(e) => logOut(e)}>
                                    <span className="text-danger">Logout</span>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData },
        ui: { languageList, language }
    } = state
    return {
        userData,
        languageList,
        language
    }
}

const mapDispatchToProps = {
    setLanguage : Ui.setLanguage
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
