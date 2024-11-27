import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import PointRedemtion from '../src/components/PointRedemtion'
import { PointRedemtionAction } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const PointRedemtionPage = (props) => {
    const { getPointRedemtionAll, userData } = props
    useEffect(() => {
        getPointRedemtionAll()
        AddLogAdmin(userData, 'Point & Redemtion', '')
    }, [])
    return (
        <BasePage>
            <PointRedemtion />
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
    getPointRedemtionAll: PointRedemtionAction.getPointRedemtionAll
}

export default connect(mapStateToProps, mapDispatchToProps)(PointRedemtionPage)
