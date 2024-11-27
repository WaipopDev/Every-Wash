import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import BasePage from '../src/components/BasePage'
import { Auth, Firestore, Database } from '../src/firebase'
import { redirectUser, reponseFirestore, reponseDatabase } from '../src/utils/helpers'

export const Logout = (props) => {
    const { userData } = props
    useEffect(() => {
      const fetchData = async ()=>{
        await Auth.signOut()
        redirectUser('/signin')
        }
        fetchData()
    }, [])
    return (
        <BasePage>
            <div>
            </div>
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

}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
