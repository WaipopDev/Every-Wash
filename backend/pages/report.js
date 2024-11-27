import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import Report from '../src/components/Report'
import { BranchActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const ReportPage = (props) => {
    const { userData, branchData, getBranch} = props
    useEffect(() => {
        AddLogAdmin(userData, 'Report', '')
        getBranch()
    }, [])
    return (
        <BasePage>
            <Report />
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage)
