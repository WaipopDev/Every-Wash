import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import Customer from '../src/components/Customer'
import { AdminActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const CustomerPage = (props) => {
    const { getCustomerAll, userData } = props
    useEffect(() => {
        // getCustomerAll()
        AddLogAdmin(userData, 'Customer', '')
    }, [])
    return (
        <BasePage>
            <Customer />
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
    getCustomerAll: AdminActions.getCustomerAll
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage)
