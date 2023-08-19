import React from "react";
import { Alert, Button } from "react-bootstrap";
import SpecRow from "./SpecRow.jsx";
import AutoConfirmCheckbox from "./AutoConfirmCheckbox.jsx";

const EntryManual = ({
    newChallengeHandler,
    setPhase,
    handleAutoConfirmClick,
}) => {
    return (
        <SpecRow>
            <h3>Register a WAX Wallet</h3>
            <p>
                This one time registration will permanently associate your WAX
                wallet address with your user account.
            </p>
            <p>You only need to do this when you want to link a new wallet!</p>
            <Alert variant="warning" className="mt-3 mb-3 c1-5rem p1rem">
                <strong>Tip:</strong> Log into your WAX wallet software like
                Anchor or{" "}
                <a href="https://www.mycloudwallet.com/" target="_blank">
                    my cloud wallet
                </a>{" "}
                <strong>before</strong> you start this process. <br />
            </Alert>
            <p>
                You won't be asked to sign anything by our website. All your
                actions take place securely in your own wallet software and are
                initiated by you.
            </p>
            <Button
                className="mx-4"
                onClick={() => {
                    newChallengeHandler();
                    setPhase(1);
                }}
            >
                Start
            </Button>
            <AutoConfirmCheckbox
                handleAutoConfirmClick={handleAutoConfirmClick}
            />
        </SpecRow>
    );
};

export default EntryManual;
