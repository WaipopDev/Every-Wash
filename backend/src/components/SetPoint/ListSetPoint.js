import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Image from "next/image";
import {
    Button,
    Table
} from 'react-bootstrap'
import moment from 'moment'
import _ from 'lodash'
import { SetPointAction } from '../../redux/actions'

export const ListSetPoint = (props) => {
    const { branchData, onEdit, pointData } = props
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
                        <th>#</th>
                        <th>Name Point</th>
                        <th>Point</th>
                        <th>Baht</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Branch</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(pointData, (res, index) => {
                        let statusName = ''
                        switch (res.status) {
                            case 1:
                                statusName = <span className="text-success">{'Active'}</span>
                                break;
                            case 2:
                                statusName = <span className="text-warning">{'Close'}</span>
                                break;
                            case 99:
                                statusName = <span className="text-danger">{'Delete'}</span>
                                break;
                            default:
                                break;
                        }
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.name}</td>
                                <td>{res.point}</td>
                                <td>{res.baht}</td>
                                <td>{moment.unix(res.startDate).format('DD-MM-YYYY')}</td>
                                <td>{moment.unix(res.endDate).format('DD-MM-YYYY')}</td>
                                <td>
                                    {
                                        _.map(res.branch, (resBranch, indexBranch) => {
                                            return (
                                                <p key={`i-${indexBranch}`}>{`${indexBranch + 1}.) ${resBranch.name}`}</p>
                                            )
                                        })
                                    }
                                </td>
                                <td>{statusName}</td>
                                <td>
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
        setPoint: { point: pointData }
    } = state
    return {
        userData,
        branchData,
        pointData
    }
}

const mapDispatchToProps = {
    getSetPointGetAll: SetPointAction.getSetPointAll
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSetPoint)
