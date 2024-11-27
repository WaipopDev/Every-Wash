import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import SetPoint from '../src/components/SetPoint'
import { AddLogAdmin } from '../src/utils/helpers'
import { BranchActions, SetPointAction } from '../src/redux/actions'

export const SetPointPage = (props) => {
    const { userData, getBranch, getSetPointGetAll } = props
    useEffect(() => {
        getBranch()
        getSetPointGetAll()
    }, [])
    return (
        <BasePage>
            <SetPoint />
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
    getBranch: BranchActions.getBranch,
    getSetPointGetAll: SetPointAction.getSetPointAll
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPointPage)
