import React from "react";

import { Spinner } from "react-bootstrap";

export default function PageChange(props) {
    return (
        <div>
            <div className="page-transition-wrapper-div">
                <div className="page-transition-icon-wrapper mb-3">
                    <Spinner
                        animation="border"
                        variant="light"
                        style={{ width: "6rem", height: "6rem", borderWidth: ".3rem" }}
                    />
                </div>

            </div>
        </div>
    );
}
