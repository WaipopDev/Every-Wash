import React from 'react'
import { connect } from 'react-redux'
import { AddLogAdmin } from '../src/utils/helpers'
export const Admin = (props) => {
    return (
        <div>
            
        </div>
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
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
