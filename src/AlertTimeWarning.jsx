import React from "react";
import { Alert, Button } from "react-bootstrap";

const AlertTimeWarning = ({ serverParams, tickdown, newChallengeHandler }) => {
    return (
        <Alert variant="dark" className="mt-3 mb-3 c1-5rem p1rem">
            <strong>Time remaining: </strong>
            <span className="tickdown">{tickdown}</span> <br />
            <span className="c1rem">
                {" "}
                (but don't freak out, you started with{" "}
                {Math.ceil(
                    (serverParams.expires - serverParams.issued) / 60000
                )}{" "}
                minutes!)
            </span>
            <Button variant="secondary" onClick={newChallengeHandler}>
                Get a New Code
            </Button>
        </Alert>
    );
};

export default AlertTimeWarning;
