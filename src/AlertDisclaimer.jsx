import React from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

const AlertDisclaimer = ({ serverParams, handleDisclaimerClick }) => {
    return (
        <Alert variant="warning" className="mt-3 p1rem">
            <strong>Note: </strong>Anything you send is{" "}
            <strong>NON-REFUNDABLE.</strong>
            <br />
            Any additional tokens you send will be considered a donation{" "}
            <FontAwesomeIcon icon={faHeart} className="mx-2" />
        </Alert>
    );
};

export default AlertDisclaimer;
