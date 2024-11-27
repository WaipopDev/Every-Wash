import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import PromptpayPage from '../src/components/Promptpay'
import { WalletAction } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const Promptpay = (props) => {
    const { getWalletAll, userData } = props
    useEffect(() => {
        // getWalletAll()
        AddLogAdmin(userData, 'Promptpay', '')
    }, [])
    return (
        <BasePage>
            <PromptpayPage />
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
    getWalletAll: WalletAction.getWalletAll
}

export default connect(mapStateToProps, mapDispatchToProps)(Promptpay)
