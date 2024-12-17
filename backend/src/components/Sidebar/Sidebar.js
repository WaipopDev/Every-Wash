import React from "react";
import { connect } from 'react-redux'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
    Container,
    Navbar,
    Nav,
} from 'react-bootstrap'
import _ from "lodash";

const Sidebar = (props) => {
    const { routes, userData, language } = props
    const router = useRouter();
    const [collapseOpen, setCollapseOpen] = React.useState(false);

    const activeRoute = (routeName) => {
        return router.route.indexOf(routeName) > -1;
    };

    const toggleCollapse = () => {
        setCollapseOpen(!collapseOpen);
    };

    const closeCollapse = () => {
        setCollapseOpen(false);
    };
    const createLinks = (routes) => {
        let i = []
        return routes.map((prop, key) => {
            let isShow = false
            if (!_.isUndefined(routes[key + 1]) && routes[key + 1].group !== prop.group) {
                isShow = true
                i.push(isShow)
            }
            return (
                <div key={key}>
                    {
                        _.includes(prop.permission, userData.type) &&
                        <Nav.Item >
                            <Link href={prop.path}>
                                <Nav.Link
                                    href={prop.path}
                                    active={activeRoute(prop.path)}
                                    onClick={closeCollapse}
                                >
                                    <i className={prop.icon} />
                                    {language[prop.name]}
                                </Nav.Link>
                            </Link>
                        </Nav.Item>
                    }
                    {isShow && userData.type != 3 && <div style={{ height: 1, background: '#000', marginTop: 5, marginBottom: 5 }}></div>}

                </div>
            );
        });
    };

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light bg-white"
            expand="md"

        >
            <Container>
                <Navbar.Brand className="pt-0">
                    <h4>Ever Wash System</h4>
                    {/* <Image alt={'logo'} className="navbar-brand-img" src={require('../../../public/img/brand/logo-1@2x.png')} /> */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="m-0">
                        {createLinks(routes)}
                    </Nav>
                </Navbar.Collapse>
                <p>V 1.0.0</p>
            </Container>

        </Navbar>
    );
}

const mapStateToProps = (state) => {
    const {
        user: {
            data: userData
        },
        ui: { language },
        permission
    } = state
    return {
        userData,
        language
    }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
