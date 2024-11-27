import React, { Component } from 'react'
import { connect } from 'react-redux'
import { useRouter } from "next/router"
import Header from "../Headers/Header"
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer"
import routes from "routes";
const BasePage = (props) => {
    const { children } = props
    const router = useRouter()

    const getBrandText = () => {
        for (let i = 0; i < routes.length; i++) {
            if (router.route.indexOf(routes[i].path) !== -1) {
                return routes[i].name;
            }
        }
        return "";
    };

    return (
        <>
            <Sidebar
                routes={routes}
            />
            <div className="main-content" >
                <Header brandText={getBrandText()} />
                {children}
                <Footer />
            </div>
        </>
    )

}

const mapStateToProps = (state) => {

    return {

    }
}

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(BasePage)
