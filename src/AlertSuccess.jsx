import React from "react";

import { Alert } from "react-bootstrap";

const AlertSuccess = ({ foundData, children }) => {
    return (
        <Alert variant="success" className="phase4 mx-auto w-75 text-center mt-5">
            {foundData && <>{foundData}</>}
            {children}
        </Alert>
    );
};

export default AlertSuccess;
