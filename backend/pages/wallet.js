import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import Wallet from '../src/components/Wallet'
import { WalletAction } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const WalletPage = (props) => {
    const { getWalletAll, userData } = props
    useEffect(() => {
        // getWalletAll()
        AddLogAdmin(userData, 'Wallet', '')
    }, [])
    return (
        <BasePage>
            <Wallet />
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage)
