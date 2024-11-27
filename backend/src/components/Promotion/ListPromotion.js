import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";
import {
    Button,
    Table
} from 'react-bootstrap'
import moment from 'moment'
import _ from 'lodash'

export const ListPromotion = (props) => {
    const { branchData, onEdit, promotionData, language } = props
    const [branch, setBranch] = useState([])
    // useEffect(() => {
    //     if (branchData.length) {
    //         setBranch(branchData)
    //     }
    // }, [branchData])

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="px-2">#</th>
                        <th className="px-2">{language['promotion_title_1']}</th>
                        <th className="px-2">{language['promotion_title_3']}</th>
                        <th className="px-2">{language['promotion_title_4']}</th>
                        <th className="px-2">{language['promotion_title_7']}</th>
                        <th className="px-2">{language['promotion_title_6']}</th>
                        <th className="px-2">{language['global_status']}</th>
                        <th className="px-2">{language['global_tool']}</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(promotionData, (res, index) => {
                        let statusName = ''
                        switch (res.status) {
                            case 1:
                                statusName = <span className="text-success">{language['global_active']}</span>
                                break;
                            case 2:
                                statusName = <span className="text-warning">{language['global_close']}</span>
                                break;
                            case 99:
                                statusName = <span className="text-danger">{language['global_delete']}</span>
                                break;
                            default:
                                break;
                        }
                        if(moment().unix() >= res.endDate){
                            statusName = <span className="text-danger">{language['global_expire']}</span>
                        }
                        return (
                            <tr key={index}>
                                <td className="px-2">{index + 1}</td>
                                <td className="px-2">{res.name}</td>
                                <td className="px-2">{moment.unix(res.startDate).format('DD-MM-YYYY')}</td>
                                <td className="px-2">{moment.unix(res.endDate).format('DD-MM-YYYY')}</td>
                                <td className="px-2">
                                    <Image alt={res.name} className="navbar-brand-img" src={res.imageUrl} width={100} height={120} />
                                </td>
                                <td className="px-2">
                                    {
                                        _.map(res.branch, (resBranch, indexBranch) => {
                                            return (
                                                <p key={`i-${indexBranch}`}>{`${indexBranch + 1}.) ${resBranch.name}`}</p>
                                            )
                                        })
                                    }
                                </td>
                                <td className="px-2">{statusName}</td>
                                <td className="px-2">
                                    <Button variant="link" className="p-0 btn-edit" onClick={(e) => onEdit(res)}>
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

const mapStateToProps = (state) => {
    const {
        user: { data: userData },
        branch: { data: branchData },
        promotion: { data: promotionData },
        ui: {language }
    } = state
    return {
        userData,
        branchData,
        promotionData,
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ListPromotion)
