import React from "react";
import { Card } from "react-bootstrap";
import Clipbox from "./Clipbox.jsx";

const CardManualTransfer = ({ serverParams }) => {
    return (
        <div className="p1rem">
            <p className="c2rem">
                To verify your WAX{" "}
                {serverParams.testnet && <strong className="cgreen">TESTNET</strong>} Wallet address
                <br />
                {serverParams.fee_enforce ? (
                    <>Send {serverParams.fee_enforce} WAXP tokens to:</>
                ) : (
                    <>send any amount of WAXP tokens to:</>
                )}
            </p>
            <Clipbox
                varname="addrcopied"
                value={serverParams.watchaddress}
                label={serverParams.watchaddress}
            />

            <div className="c1-5rem mt-3">Please send exactly this amount:</div>
            <Clipbox
                varname="feecopied"
                value={serverParams.fee_enforce}
                label={`${serverParams.fee_enforce} WAXP Tokens`}
                byline={
                    <>
                        <strong>Double check this</strong>, we don't accept partial amounts!
                    </>
                }
            />

            <div className="c1-5rem mt-3">
                but make sure to <strong>USE THIS EXACT TRANSFER MEMO: </strong>
                <Clipbox
                    className="c1rem"
                    varname="secretcopied"
                    value={serverParams.secret}
                    label={serverParams.secret}
                    byline="We use the memo to figure out who you are!"
                />
            </div>
        </div>
    );
};

export default CardManualTransfer;
