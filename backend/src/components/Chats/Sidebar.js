import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";

import Scrollbar from '../Scrollbar'
import Search from './Search'
import { Database } from '../../firebase'

import { Badge } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

export const Sidebar = (props) => {
    const {
        dataChat,
        onActive,
        language
    } = props

    const [active, setActive] = useState({})

    const readAdmin = async (uid) => {
        try {
            await Database.readNotiChatAdmin(uid)
        } catch (error) {

        }
    }
    
    useEffect(() => {
        if (!_.isUndefined(active.uid)) {
            readAdmin(active.uid)
            onActive(active)
        }
    }, [active])

    // let item = []
    // for (let index = 0; index < 20; index++) {
    //     item.push(
    //         <div className={`media${index === 0 ? ' active' : ''}`} key={index}>
    //             <div className="item-avatar">
    //                 <div className="avatar">
    //                     <Image className="w-100" src={require('../../../public/img/theme/team-3-800x800.jpg')} alt="Generic placeholder image" />
    //                 </div>
    //             </div>
    //             <div className="media-body px-3">
    //                 <div className="media-title">
    //                     <h6 className="m-0 line-1">Name {index}  </h6>
    //                     <span className="content-time"><i className="far fa-clock"></i> 10.05</span>
    //                 </div>
    //                 <div className="media-title">
    //                     <small className="line-1">test test</small>
    //                     {
    //                         index !== 0 &&
    //                         <Badge bg="danger">{index}</Badge>
    //                     }
    //                 </div>
    //             </div>
    //         </div>
    //     )

    // }
    return (
        <div className="sidebar">
            <Search />
            <h6>{language['chats_title_1']}</h6>
            <Scrollbar className="sidebar-messages">
                {
                    _.map(_.orderBy(dataChat,'firstName','asc'), (res, index) => {
                        const modifyAt = res.modifyAt * 1000
                        let iscurrentDate = moment(modifyAt).isSame(new Date(), "day");
                        let dateText = moment(modifyAt).format('LT');
                        if (!iscurrentDate) {
                            dateText = moment(modifyAt).format('l')
                        }

                        return (
                            <div className={`media${res.uid === active.uid ? ' active' : ''}`} key={index} onClick={() => setActive(res)}>
                                <div className="item-avatar">
                                    <div className="avatar">
                                        <Image className="w-100" src={require('../../../public/img/brand/person.png')} alt="Generic placeholder image" />
                                    </div>
                                </div>
                                <div className="media-body px-3">
                                    <div className="media-title">
                                        <h6 className="m-0 line-1">{`${res.firstName}`}</h6>
                                        <span className="content-time"><i className="far fa-clock"></i> {dateText}</span>
                                    </div>
                                    <div className="media-title">
                                        <small className="line-1" >{res.isList}</small>
                                        {
                                            res.notiAdminCount !== 0 &&
                                            <Badge bg="danger">{res.notiAdminCount}</Badge>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </Scrollbar>
        </div>
    )
}

const mapStateToProps = (state) => {
    const {
        chat: {
            data: dataChat
        },
        ui:{language}
    } = state
    return {
        dataChat,
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
