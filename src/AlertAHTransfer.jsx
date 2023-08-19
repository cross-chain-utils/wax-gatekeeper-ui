import React from "react";
import { Alert, Button, Row, Col } from "react-bootstrap";

const AlertAHTransfer = ({ serverParams, buttonOnly }) => {
    const AHButton = (
        <>
            <a
                href={`https://${
                    serverParams.testnet ? "wax-test" : "wax"
                }.atomichub.io/trading/token-transfer?quantity=${
                    serverParams.fee_enforce
                }&partner=${serverParams.watchaddress}&memo=${encodeURIComponent(
                    serverParams.secret
                )}`}
                target="_blank">
                <Button>Send with AtomicHub</Button>
            </a>
            <br /> No copy/paste required!
        </>
    );

    return buttonOnly ? (
        AHButton
    ) : (
        <Alert variant="info" className="mt-3 mb-3 c1rem p1rem">
            <Row>
                <Col>
                    <strong className="t1_5rem">
                        Did you know you can use AtomicHub to send the transfer?
                    </strong>{" "}
                    <br />
                </Col>
                <Col>{AHButton}</Col>
            </Row>
        </Alert>
    );
};

export default AlertAHTransfer;
