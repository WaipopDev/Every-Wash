import React from "react";

import { Spinner, Modal } from "react-bootstrap";


export default function LoadProcess(props) {
    return (
        <Modal show={props.isShow} className="load-process" centered>
             <div className="page-transition-wrapper-div">
                <div className="page-transition-icon-wrapper mb-3">
                    <Spinner
                        animation="border"
                        variant="light"
                        style={{ width: "6rem", height: "6rem", borderWidth: ".3rem" }}
                    />
                </div>

            </div>
        </Modal>
    );
}
