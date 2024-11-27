import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import WashingMachine from '../src/components/WashingMachine'
import { BranchActions, Program, WashingMachineActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const WashingMachinePage = (props) => {
    const { getBranch, getProgramWashingMachine, getProgramClothesDryer, getWashingMachine, userData } = props
    useEffect(() => {
        getBranch()
        getProgramWashingMachine()
        getProgramClothesDryer()
        getWashingMachine()
        AddLogAdmin(userData, 'Machine', '')
    }, [])
    return (
        <BasePage>
            <WashingMachine />
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
    getProgramWashingMachine: Program.getProgramWashingMachine,
    getProgramClothesDryer: Program.getProgramClothesDryer,
    getWashingMachine: WashingMachineActions.getWashingMachine
}

export default connect(mapStateToProps, mapDispatchToProps)(WashingMachinePage)
