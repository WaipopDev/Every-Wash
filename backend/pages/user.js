import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import ListAdmin from '../src/components/Admin/ListAdmin'
import { AdminActions, BranchActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const UserPage = (props) => {
    const { getAdminAll, userData, getBranch } = props
    useEffect(() => {
        getAdminAll()
        getBranch()
        AddLogAdmin(userData, 'User', '')
    }, [])

    return (
        <BasePage>
            <ListAdmin />
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
    getAdminAll: AdminActions.getAdminAll,
    getBranch: BranchActions.getBranch,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
