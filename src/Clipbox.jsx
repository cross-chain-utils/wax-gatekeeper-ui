import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons/faClipboard";

const Clipbox = ({ varname, value, label, byline, className }) => {
    return (
        <>
            <div
                className={`mb-1 text-left clipbox ${className ?? ""}`}
                onClick={() => {
                    window.WAXPOT.copyToClipboard(varname, value);
                }}
            >
                <FontAwesomeIcon icon={faClipboard} className="mx-2" />
                <span>{label}</span>
                <div className="ctooltip" id={varname}>
                    Copied
                </div>
            </div>
            {byline && <p className="c1rem">{byline}</p>}
        </>
    );
};

export default Clipbox;
