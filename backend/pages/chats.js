import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import {
    Main,
    Search,
    Sidebar
} from '../src/components/Chats'
import BasePage from '../src/components/BasePage'
import {
    Container,
    Row,
    Col
} from "react-bootstrap";
import { AddLogAdmin } from '../src/utils/helpers'
import { ChatAction } from '../src/redux/actions'
import { Database } from '../src/firebase'

export const Chats = (props) => {
    const { userData, getChat,getChatData, updateChat } = props
    const [active, setActive] = useState({})
    useEffect(() => {
        AddLogAdmin(userData, 'Chats', '')
        getChatDataFn()
        Database.onChat(e => onChat(e))
    }, [])
    const getChatDataFn = async () => {
        try {
            const dataChat =  await Database.getChat()
            getChatData(dataChat.val())
        } catch (error) {
            console.log(`error getChat`, error)
        }
    }
    const onChat = (e) => {
        updateChat({ [e.key]: e.val() })
    }
    return (
        <BasePage>
            <Container fluid className="chats">
                <Row className="py-md-4">
                    <Col className="mb-5 mb-xl-0" xl="4">
                        <Sidebar onActive={(e) => setActive(e)} />
                    </Col>
                    <Col className="mb-5 mb-xl-0" xl="8">
                        <Main {...active} />
                    </Col>
                </Row>
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
    getChat: ChatAction.getChat,
    updateChat: ChatAction.updateChat,
    getChatData: ChatAction.getChatData,
}

export default connect(mapStateToProps, mapDispatchToProps)(Chats)
