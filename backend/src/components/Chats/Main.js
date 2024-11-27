import React, { useRef } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";
import Scrollbar from '../Scrollbar'
import ChatGroup from './ChatGroup'
import {
    Form,
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import { Database } from '../../firebase'
import _ from 'lodash';
import moment from 'moment';
export const Main = (props) => {
    const { uid, firstName, lastName, notiUserCount } = props
    if (_.isUndefined(uid)) {
        return null
    }
    let messagesRef = useRef()
    const sentMsg = async () => {
        const text = messagesRef.current
        
        if (text.value) {
            const param = {
                message: text.value,
                createAt: moment().unix(),
                status: 1,
                type: 'admin',
                userRead: false,
                adminRead: true
            }
            await Database.sendChat(uid, param)
            await Database.sendNotiChat(uid, Number(notiUserCount) + 1, text.value)
        }
        text.value = ''
    }
    return (
        <div className="content">
            <div className="content-header">
                <div className={`media align-items-center`}>
                    <div className="item-avatar">
                        <div className="avatar">
                            <Image className="w-100" src={require('../../../public/img/brand/person.png')} alt="Generic placeholder image" />
                        </div>
                    </div>
                    <div className="media-body px-3">
                        <h6 className="m-0">{`${firstName} ${lastName}`}</h6>
                    </div>
                    <div className="media-footer px-3">
                        <Button color="link">
                            <i className="fas fa-ellipsis-v"></i>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="content-body">
                <Scrollbar>
                    <ChatGroup {...props} />
                </Scrollbar>
            </div>
            <div className="content-footer">
                <Form className="form-chats py-3 w-100">
                    <FormGroup>
                        <FormControl ref={messagesRef} type="text" name="chats" placeholder="Enter Message..." />
                    </FormGroup>
                </Form>
                {/* <div className="py-3 button-chats">
                    <Button color="link">
                        <i className="fas fa-paperclip"></i>
                    </Button>
                </div>
                <div className="py-3 button-chats">
                    <Button color="link">
                        <i className="far fa-image"></i>
                    </Button>
                </div> */}
                <div className="py-3 button-chats">
                    <Button color="primary" onClick={() => sentMsg()}>
                        <i className="fab fa-telegram-plane"></i>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
