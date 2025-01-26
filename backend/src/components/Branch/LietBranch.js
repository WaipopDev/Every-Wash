import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import {
    Button,
    Table
} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

export const LietBranch = (props) => {
    const { branchData, onEdit, onEditBank, onEditExpire, onPay, onBankSelect, language, handleDelete } = props
    const [branch, setBranch] = useState([])
    useEffect(() => {
        if (branchData.length) {
            setBranch(branchData)
        }
    }, [branchData])
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{language['global_branch_name']}</th>
                        <th>{language['branch_title_13']}</th>
                        <th>{language['global_status']}</th>
                        <th>{language['branch_title_26']}</th>
                        <th>{language['branch_title_7']}</th>
                        <th>{language['branch_title_12']}</th>
                        <th>{language['branch_title_27']}</th>
                        <th>{language['global_tool']}</th>
                    </tr>
                </thead>
                <tbody>
                    {branch.map((res, index) => {
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
                        let statusNamePay = ''
                        switch (res.statusClosePay) {
                            case true:
                                statusNamePay = <span className="text-success">{language['global_enabled']}</span>
                                break;
                            case false:
                                statusNamePay = <span className="text-danger">{language['global_disabled']}</span>
                                break;
                            default:
                                statusNamePay = <span className="text-success">{language['global_enabled']}</span>
                                break;
                        }
                        let expire = ''
                        if(res.expire){
                            expire = moment(res.expire * 1000).format('DD-MM-YYYY')
                        }
                        return (
                            <tr key={index}>
                                <td className="px-2">{index + 1}</td>
                                <td className="px-2">{res.name}</td>
                                <td className="px-2">{res.idBranch}</td>
                                <td className="px-2">{statusName}</td>
                                <td className="px-2">{statusNamePay}</td>
                                <td className="px-2">{expire}</td>
                                <td className="px-2">{res.ppId}</td>
                                <td className="px-2">
                                    <Button variant="secondary" className="px-2 py-0 btn-edit" onClick={(e) => onBankSelect(res)}>
                                        {res.bankType ? res.bankType : 'SCB'}
                                    </Button>
                                </td>
                                <td className="px-2">
                                    <Button variant="link" className="px-2 py-0 btn-edit" onClick={(e) => onEdit(res)}>
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                    <Button variant="link" className="px-2 py-0 btn" onClick={(e) => onEditBank(res)}>
                                        <i className="fas fa-university"></i>
                                    </Button>
                                    <Button variant="link" className="px-2 py-0 btn-expire" onClick={(e) => onEditExpire(res)}>
                                        <i className="fas fa-clock"></i>
                                    </Button>
                                    <Button variant="link" className="px-2 py-0 btn" onClick={(e) => onPay(res)}>
                                        <i className="fas fa-comment-dollar"></i>
                                    </Button>
                                    <Button variant="link" className="px-2 py-0 btn-expire" onClick={(e) => handleDelete(res)}>
                                        <i className="fas  fa-trash"></i>
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
        ui:{language}
    } = state
    return {
        userData,
        branchData,
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LietBranch)
