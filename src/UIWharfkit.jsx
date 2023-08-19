import React, { useState } from "react";
import { Modal, Spinner, Row, Col, Tab, Tabs } from "react-bootstrap";
import EntryManual from "./EntryManual.jsx";
import AlertSuccess from "./AlertSuccess.jsx";
import AlertFoundTX from "./AlertFoundTX.jsx";
import AlertAHTransfer from "./AlertAHTransfer.jsx";
import AlertVideoLinks from "./AlertVideoLinks.jsx";
import CardManualTransfer from "./CardManualTransfer.jsx";
import AlertTimeWarning from "./AlertTimeWarning.jsx";
import AlertImpatientUser from "./AlertImpatientUser.jsx";
import AlertDisclaimer from "./AlertDisclaimer.jsx";
import ModalCancelRegistration from "./ModalCancelRegistration.jsx";
import ModalExpired from "./ModalExpired.jsx";
const WharfKitLogin = React.lazy(() => import("./WharfKitLogin.jsx"));

const UIWharfkit = ({
    setPhase,
    newChallengeHandler,
    setAutoConfirm,
    setShowCancel,
    serverParams,
    tickdown,
    showCancel,
    phase,
    handleReset,
    foundData,
    confirmHandler,
    children,
}) => {
    const [key, setKey] = useState("Local");

    return (
        <>
            {phase === 0 && (
                <EntryManual
                    setPhase={setPhase}
                    newChallengeHandler={newChallengeHandler}
                    handleAutoConfirmClick={setAutoConfirm}
                />
            )}
            <Modal
                className="modal-xl"
                fullscreen={"xl-down"}
                backdrop="static"
                show={phase === 1}
                onHide={() => {
                    setShowCancel(true);
                }}>
                <Modal.Header closeButton>
                    <Modal.Title>Link WAX Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {serverParams && (
                        <div className="text-center phase1 p1rem">
                            <Row>
                                <Col className="col-12 col-lg-6">
                                    <Tabs
                                        activeKey={key}
                                        onSelect={(k) => setKey(k)}
                                        className="mb-3">
                                        <Tab eventKey="Local" title="Local Wallet Login">
                                            <WharfKitLogin serverParams={serverParams} />
                                        </Tab>
                                        <Tab eventKey="Manual" title="Manual">
                                            <CardManualTransfer serverParams={serverParams} />
                                            <AlertVideoLinks />
                                        </Tab>
                                        <Tab eventKey="External" title="Use External Site">
                                            <h3>Don't get distracted!</h3>
                                            <p>
                                                You'll need to come back to this tab to complete
                                                your registration after you finish the transfer.
                                            </p>
                                            <AlertAHTransfer
                                                buttonOnly={true}
                                                serverParams={serverParams}
                                            />
                                            <div className="mt-5">
                                                Scanning the blockchain for your transfer...{" "}
                                                <Spinner size={"sm"} />
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Col>
                                <Col className="col-12 col-lg-6">
                                    <h3 className="mt-3">Don't close this window!</h3>
                                    <AlertTimeWarning
                                        serverParams={serverParams}
                                        tickdown={tickdown}
                                        newChallengeHandler={newChallengeHandler}
                                    />

                                    <AlertDisclaimer />
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <ModalCancelRegistration
                show={phase === 1 && showCancel}
                handelClose={setShowCancel}
                handleCancelReg={handleReset}
            />

            {phase === 2 && <AlertImpatientUser serverParams={serverParams} />}

            <ModalExpired foundData={foundData} show={phase === 3} handleReset={handleReset} />

            {phase === 4 && (
                <AlertFoundTX
                    foundData={foundData}
                    handleNo={() => {
                        setPhase(0);
                    }}
                    handleYes={confirmHandler}
                />
            )}
            {phase === 5 && <AlertSuccess foundData={foundData}>{children}</AlertSuccess>}
        </>
    );
};

export default UIWharfkit;
