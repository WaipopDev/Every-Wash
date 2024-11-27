import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from "react-bootstrap";
export const Footer = (props) => {
    return (
        <footer className="footer">
            <Row className="align-items-center justify-content-xl-between">
                <Col xl="6">
                    <div className="copyright text-center text-xl-left text-muted">
                        Image Wash /
                        <a
                            className="font-weight-bold ml-1"
                            href="https://www.image-wash.com"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {' www.image-wash.com'}
                        </a>
                    </div>
                </Col>
            </Row>
        </footer>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
