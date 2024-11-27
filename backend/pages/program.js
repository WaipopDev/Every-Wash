import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import CreateProgram from '../src/components/Program/CreateProgram'
import TabProgram from '../src/components/Program/TabProgram'
import { Program, BranchActions } from '../src/redux/actions'
import { AddLogAdmin } from '../src/utils/helpers'

export const ProgramPage = (props) => {
    const { getProgramWashingMachine, getProgramClothesDryer, userData, getBranch } = props
    useEffect(() => {
        getProgramWashingMachine()
        getProgramClothesDryer()
        getBranch()
        AddLogAdmin(userData, 'Program', '')
    }, [])
    return (
        <BasePage>
            <CreateProgram />
            <TabProgram />
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
    getProgramWashingMachine: Program.getProgramWashingMachine,
    getProgramClothesDryer: Program.getProgramClothesDryer,
    getBranch: BranchActions.getBranch,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramPage)
