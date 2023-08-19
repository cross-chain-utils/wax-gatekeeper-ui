import React from "react";
import { Button } from "react-bootstrap";

import SpecRow from "./SpecRow.jsx";

const AlertFoundTX = ({ foundData, handleNo, handleYes }) => {
    return (
        <SpecRow>
            <strong className="t2rem mt-3">
                Found a Transaction! Is this you?
                <br />
            </strong>

            <div className="mx-auto w-100 text-center mt-3 mb-3">
                <strong className="t2rem foundData">
                    {foundData ? foundData : "Loading..."}
                </strong>
                <br />
                <Button
                    variant="danger"
                    className="mt-3 mx-4"
                    onClick={() => {
                        handleNo();
                    }}
                >
                    No, that's not me!
                </Button>
                <Button variant="success" className="mt-3" onClick={handleYes}>
                    Yes, that's me!
                </Button>
            </div>
        </SpecRow>
    );
};

export default AlertFoundTX;
