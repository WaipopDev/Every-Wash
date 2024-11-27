import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";
import _ from 'lodash';
import moment from 'moment';


export const ChatGroup = (props) => {
    let { uid, firstName, lastName, dataChat } = props
    const [message, setMessage] = useState(props.message)
    let messagesEndRef = useRef()
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [message])
    useEffect(() => {
        setMessage(dataChat[uid].message)
    }, [dataChat[uid]])
    return (
        <div className="chat-data" id="chat-data">
            {
                _.map(_.orderBy(_.values(message), 'createAt', 'asc'), (res, index) => {
                    const createAt = res.createAt * 1000
                    let iscurrentDate = moment(createAt).isSame(new Date(), "day");
                    let dateText = moment(createAt).format('LT');
                    if (!iscurrentDate) {
                        dateText = moment(createAt).format('l')
                    }

                    if (res.type === 'user') {
                        return (
                            <div className="py-2 content-item-left" key={index}>
                                <div className="item-avatar">
                                    <div className="avatar">
                                        <Image src={require('../../../public/img/brand/person.png')} alt="Card image cap" />
                                    </div>
                                </div>
                                <div className="item-body">
                                    <div className="content-detail">
                                        {res.message}
                                        <span className="content-time"><i className="far fa-clock"></i> {dateText}</span>
                                    </div>
                                    <p className="m-0 item-name">
                                        {`${firstName} ${lastName}`}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div className="py-2 content-item-right" key={index}>
                            <div className="item-right">
                                <div className="item-body">
                                    <div className="content-detail">
                                        {res.message}
                                        <span className="content-time"><i className="far fa-clock"></i> {dateText}</span>
                                    </div>
                                    <p className="m-0 item-name">
                                        Admin
                                    </p>
                                </div>
                                <div className="item-avatar">
                                    <div className="avatar">
                                        <Image src={require('../../../public/img/brand/profile.png')} alt="Card image cap" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

            <div ref={messagesEndRef} />

        </div>
    )
}

const mapStateToProps = (state) => {
    const {
        chat: {
            data: dataChat
        }
    } = state
    return {
        dataChat
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatGroup)
