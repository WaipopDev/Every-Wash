import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import CodePromotioin from '../src/components/CodePromotioin'
import { AddLogAdmin } from '../src/utils/helpers'
import { BranchActions } from '../src/redux/actions'

export const CodePromotioinPage = (props) => {
    const { userData,getBranch } = props
    useEffect(() => {
        getBranch()
        AddLogAdmin(userData, 'Code Promotion', '')
    }, [])
    return (
        <BasePage>
            <CodePromotioin />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CodePromotioinPage)
