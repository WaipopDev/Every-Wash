import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import Promotion from '../src/components/Promotion'
import { AddLogAdmin } from '../src/utils/helpers'
import { BranchActions, PromotionAction } from '../src/redux/actions'

export const PromotionPage = (props) => {
    const { userData, getBranch, getPromotion } = props
    useEffect(() => {
        AddLogAdmin(userData, 'Promotion', '')
        getBranch()
        getPromotion()
    }, [])
    return (
        <BasePage>
            <Promotion />
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
    getPromotion: PromotionAction.getPromotion
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionPage)
