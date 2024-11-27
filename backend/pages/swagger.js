import React from 'react'
import { connect } from 'react-redux'
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export const swagger = (props) => {
    return (
        <div>
            <SwaggerUI
             url="/api/swagger" 

             />
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

export default connect(mapStateToProps, mapDispatchToProps)(swagger)
