import React from "react";
import SpecRow from "./SpecRow.jsx";

const AlertImpatientUser = ({ serverParams }) => {
    return (
        <SpecRow>
            Waiting for your transfer to{" "}
            <span className="cred">{serverParams.watchwallet} </span>
            <br />
            with the SPECIAL MEMO:{" "}
            <span className="cred">{serverParams.secret}</span>
            <br />
            and the exact amount of{" "}
            <span className="cred">{serverParams.fee_enforce} WAXP Tokens</span>
            <div className="mx-auto w-75 text-center mt-5 mb-5">
                <div className="spinner-border text-danger">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="pollworker">Checking for your transfer...</p>
            </div>
        </SpecRow>
    );
};

export default AlertImpatientUser;
