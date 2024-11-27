import React from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const ScrollBar = ({ children, ...rest }) => {
    return (
        <div {...rest}>
            <PerfectScrollbar>{children}</PerfectScrollbar>
        </div>
    );
};

export default ScrollBar;
