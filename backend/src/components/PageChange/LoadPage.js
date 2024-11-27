import React from "react";

import { Spinner } from "react-bootstrap";

export default function LoadPage(props) {
    return (
            <div className="page-load">
                <div className="page-load-spinner mb-3">
                    <Spinner
                        animation="border"
                        variant="light"
                        style={{ width: "6rem", height: "6rem", borderWidth: ".3rem" }}
                    />
                </div>

            </div>
    );
}
