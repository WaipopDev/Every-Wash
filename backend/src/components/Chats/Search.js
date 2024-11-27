import React from 'react'
import { connect } from 'react-redux'

import { FormControl, InputGroup} from 'react-bootstrap';

export const Search = (props) => {
    const { language } = props
    return (
        <div className="search-input py-3">
            <InputGroup className="custom">
                <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                <FormControl placeholder={language['language']} />
            </InputGroup>
        </div>
    )
}

const mapStateToProps = (state) => {
    const {
        ui:{language}
    } = state
    return {
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
