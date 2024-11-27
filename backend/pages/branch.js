import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import Branch from '../src/components/Branch'
import { BranchActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'
export const BranchPage = (props) => {
    const { getBranch,userData } = props
    useEffect(() => {
        getBranch()
        AddLogAdmin(userData.id,'Branch','')
    }, [])
    return (
        <BasePage>
            <Branch />
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
    getBranch: BranchActions.getBranch
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchPage)
