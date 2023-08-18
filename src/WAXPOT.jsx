import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Spinner, Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons/faClipboard";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

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

const SpecRow = ({ children }) => {
    return (
        <Row className="justify-content-center">
            <Col className="col-12 col-lg-6">
                <Card className="phase0 mx-auto mt-3">
                    <Card.Body className="p2rem">{children}</Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

const WAXPOT = ({ serverGet }) => {
    // Need to get secret/clientkey/expires/testnet from server

    const [phase, setPhase] = useState(0);
    const [serverParams, setServerParams] = useState(null);
    const [txConfirm, setTxConfirm] = useState(null);
    const [foundData, setFoundData] = useState({});
    const [tickdown, setTickdown] = useState("Loading...");
    const [syncCt, setSyncCt] = useState(0);
    const [showCancel, setShowCancel] = useState(false);
    const [autoConfirm, setAutoConfirm] = useState(true);

    useEffect(() => {
        if (!window.WAXPOT || syncCt === 0) {
            return;
        }

        // TODO: move this to a child control
        const confirmHandler = async (txOverride) => {
            const txConfirmVal = txOverride ?? txConfirm;

            if (txConfirmVal) {
                const res = await window.WAXPOT.notifier(
                    txConfirmVal.memo,
                    txConfirmVal.txid
                );

                if (res) {
                    setFoundData(res.message);
                    setPhase(5);
                } else {
                    setPhase(3);
                    setFoundData("Failed.");
                }
            }
        };

        (async (WAXPOT) => {
            const localServerParams = await serverGet();

            try {
                // Get the remote server's params based on what our server generated (includes defaults and overrides)
                const remoteServerParams = await WAXPOT.postLogin({
                    ...localServerParams,
                    clientmode: "fetch",
                });

                setServerParams(remoteServerParams);
                if (remoteServerParams === null) {
                    setPhase(3);
                    setServerParams({});
                    setFoundData("Failed to fetch server params.");
                    return;
                }

                console.log("SERVER MODIFIED PARAMS", remoteServerParams);

                WAXPOT.customUI({
                    testnet: remoteServerParams.testnet == true,
                    singleAPI: remoteServerParams.singleAPI,
                    issued: +remoteServerParams.issued,
                    expires: remoteServerParams.expires,
                    wallet: remoteServerParams.watchaddress,
                    memo: remoteServerParams.secret,
                    clientkey: remoteServerParams.clientkey,
                    displaySecretToUser: ({ secret, wallet }) => {},
                    tick: () => {
                        const calcTick = Math.floor(
                            (remoteServerParams.expires - Date.now()) / 1000
                        );
                        setTickdown(
                            +calcTick > 0 ? calcTick + " seconds" : "Expired"
                        );
                    },
                    success: ({ from, txid, memo }) => {
                        // Trigger verification. Don't care that it's async.
                        setFoundData(from);
                        setTxConfirm({ txid, memo });

                        if (autoConfirm) {
                            confirmHandler({ txid, memo });
                        } else {
                            setPhase(4);
                        }
                    },
                    fail: ({ code, message }) => {
                        console.log("fail", code, message);

                        if (code === 0) {
                            setPhase(3);
                            setFoundData(null);
                        } else {
                            setPhase(3);
                            setFoundData("Error: " + message);
                        }
                    },
                    wait: () => {
                        setPhase(2);
                    },
                });
            } catch (e) {
                console.log("error", e);
                setPhase(3);
                setServerParams({});
                setFoundData("Error: " + e);
            }
        })(window.WAXPOT);
    }, [window.WAXPOT, syncCt]);

    const newChallengeHandler = () => {
        setSyncCt(syncCt + 1);
    };

    if (serverParams == null && phase > 0) {
        return (
            <>
                <Spinner></Spinner>
            </>
        );
    }

    const handleReset = () => {
        setPhase(0);
        setServerParams({});
        setFoundData(null);
        setTxConfirm(null);
        setTickdown(0);
        setShowCancel(false);
        window.WAXPOT.stop();
    };

    return (
        <>
            {phase === 0 && (
                <SpecRow>
                    <h3>Register a WAX Wallet</h3>
                    <p>
                        This one time registration will permanently associate
                        your WAX wallet address with your user account.
                    </p>
                    <p>
                        You only need to do this when you want to link a new
                        wallet!
                    </p>
                    <Alert
                        variant="warning"
                        className="mt-3 mb-3 c1-5rem p1rem"
                    >
                        <strong>Tip:</strong> Log into your WAX wallet software
                        like Anchor or{" "}
                        <a
                            href="https://www.mycloudwallet.com/"
                            target="_blank"
                        >
                            my cloud wallet
                        </a>{" "}
                        <strong>before</strong> you start this process. <br />
                    </Alert>
                    <p>
                        You won't be asked to sign anything by our website. All
                        your actions take place securely in your own wallet
                        software and are initiated by you.
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
                    <div className="t1_5rem d-inline-block">
                        <input
                            type="checkbox"
                            style={{
                                transform: "scale(1.5)",
                                marginRight: "0.5rem",
                            }}
                            checked={autoConfirm}
                            onChange={(e) => {
                                setAutoConfirm(e.target.checked);
                            }}
                        />{" "}
                        Auto Confirm
                        <br />
                    </div>
                </SpecRow>
            )}
            <Modal
                className="modal-xl"
                fullscreen={"xl-down"}
                backdrop="static"
                show={phase === 1}
                onHide={() => {
                    setShowCancel(true);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Link WAX Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {serverParams && (
                        <div className="text-center phase1 p1rem">
                            <Row>
                                <Col className="col-12 col-lg-6">
                                    <Card className="p1rem">
                                        <p className="c2rem">
                                            To verify your WAX{" "}
                                            {serverParams.testnet && (
                                                <strong className="cgreen">
                                                    TESTNET
                                                </strong>
                                            )}{" "}
                                            Wallet address
                                            <br />
                                            {serverParams.fee_enforce ? (
                                                <>
                                                    {" "}
                                                    send{" "}
                                                    {
                                                        serverParams.fee_enforce
                                                    }{" "}
                                                    WAXP tokens to:
                                                </>
                                            ) : (
                                                <>
                                                    {" "}
                                                    send any amount of WAXP
                                                    tokens to:
                                                </>
                                            )}
                                        </p>
                                        <Clipbox
                                            varname="addrcopied"
                                            value={serverParams.watchaddress}
                                            label={serverParams.watchaddress}
                                        />

                                        <div className="c1-5rem mt-3">
                                            Please send exactly this amount:
                                        </div>
                                        <Clipbox
                                            varname="feecopied"
                                            value={serverParams.fee_enforce}
                                            label={`${serverParams.fee_enforce} WAXP Tokens`}
                                            byline={
                                                <>
                                                    <strong>
                                                        Double check this
                                                    </strong>
                                                    , we don't accept partial
                                                    amounts!
                                                </>
                                            }
                                        />

                                        <div className="c1-5rem mt-3">
                                            but make sure to{" "}
                                            <strong>
                                                USE THIS EXACT TRANSFER MEMO:{" "}
                                            </strong>
                                            <Clipbox
                                                className="c1rem"
                                                varname="secretcopied"
                                                value={serverParams.secret}
                                                label={serverParams.secret}
                                                byline="We use the memo to figure out who you are!"
                                            />
                                        </div>
                                    </Card>
                                </Col>
                                <Col className="col-12 col-lg-6">
                                    <h3>Don't close this window!</h3>

                                    <Alert
                                        variant="dark"
                                        className="mt-3 mb-3 c1-5rem p1rem"
                                    >
                                        <strong>Time remaining: </strong>
                                        <span className="tickdown">
                                            {tickdown}
                                        </span>{" "}
                                        <br />
                                        <span className="c1rem">
                                            {" "}
                                            (but don't freak out, you started
                                            with{" "}
                                            {Math.ceil(
                                                (serverParams.expires -
                                                    serverParams.issued) /
                                                    60000
                                            )}{" "}
                                            minutes!)
                                        </span>
                                        <Button
                                            variant="secondary"
                                            onClick={newChallengeHandler}
                                        >
                                            Get a New Code
                                        </Button>
                                    </Alert>
                                    <Alert
                                        variant="info"
                                        className="mt-3 mb-3 c1rem p1rem"
                                    >
                                        <Row>
                                            <Col>
                                                <strong className="t1_5rem">
                                                    Did you know you can use
                                                    AtomicHub to send the
                                                    transfer?
                                                </strong>{" "}
                                                <br />
                                            </Col>
                                            <Col>
                                                {" "}
                                                <a
                                                    href={`https://${
                                                        serverParams.testnet
                                                            ? "wax-test"
                                                            : "wax"
                                                    }.atomichub.io/trading/token-transfer?quantity=${
                                                        serverParams.fee_enforce
                                                    }&partner=${
                                                        serverParams.watchaddress
                                                    }&memo=${encodeURIComponent(
                                                        serverParams.secret
                                                    )}`}
                                                    target="_blank"
                                                >
                                                    <Button>
                                                        Send with AtomicHub
                                                    </Button>
                                                </a>
                                                <br /> No copy/paste required!
                                            </Col>
                                        </Row>
                                    </Alert>
                                    <p>
                                        Watch a video for ANCHOR or WAX CLOUD
                                        WALLET
                                    </p>
                                    {/* <Button variant="warning" onClick={window.WAXPOT.impatientUser}>I sent it! Now what?</Button> */}
                                    <Alert
                                        variant="warning"
                                        className="mt-3 p1rem"
                                    >
                                        <strong>Note: </strong>Anything you send
                                        is <strong>NON-REFUNDABLE.</strong>
                                        <br />
                                        Any additional tokens you send will be
                                        considered a donation{" "}
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className="mx-2"
                                        />
                                    </Alert>
                                    <div className="mt-3">
                                        Scanning the blockchain for your
                                        transfer... <Spinner size={"sm"} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Modal
                className="modal-md text-light bg-dark"
                show={phase === 1 && showCancel}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Wallet Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Closing this dialog will reset the current transfer and
                        you will get a new memo next time you open it.
                    </p>
                    <p>
                        <strong>
                            Are you sure you want to cancel this wallet
                            registration?
                        </strong>
                    </p>
                    <Button
                        className="mx-4"
                        variant="primary"
                        onClick={() => {
                            setShowCancel(false);
                        }}
                    >
                        No
                    </Button>
                    <Button
                        className="float-right"
                        variant="danger"
                        onClick={handleReset}
                    >
                        Yes
                    </Button>
                </Modal.Body>
            </Modal>

            {phase === 2 && (
                <SpecRow>
                    Waiting for your transfer to{" "}
                    <span className="cred">pubhubminter </span>
                    <br />
                    with the SPECIAL MEMO:{" "}
                    <span className="cred">
                        4ca5d914-15e3-4e0e-9035-4d3fad577e90
                    </span>
                    <br />
                    and the exact amount of{" "}
                    <span className="cred">0.0001 WAXP Tokens</span>
                    <div className="mx-auto w-75 text-center mt-5 mb-5">
                        <div className="spinner-border text-danger">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="pollworker">
                            Checking for your transfer...
                        </p>
                    </div>
                </SpecRow>
            )}

            <Modal className="modal-md" show={phase === 3}>
                <Modal.Header>
                    <Modal.Title>Link Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!foundData && (
                        <>
                            Transfer took too long and expired. Please try
                            again.
                            <br />
                        </>
                    )}
                    {foundData && (
                        <>
                            {foundData}
                            <br />
                        </>
                    )}

                    <Button
                        className="float-right mt-3"
                        variant="primary"
                        onClick={handleReset}
                    >
                        OK
                    </Button>
                </Modal.Body>
            </Modal>

            {phase === 4 && (
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
                                setPhase(0);
                            }}
                        >
                            No, that's not me!
                        </Button>
                        <Button
                            variant="success"
                            className="mt-3"
                            onClick={confirmHandler}
                        >
                            Yes, that's me!
                        </Button>
                    </div>
                </SpecRow>
            )}
            {phase === 5 && (
                <>
                    <Alert
                        variant="success"
                        className="phase4 mx-auto w-75 text-center mt-5"
                    >
                        {foundData && <>{foundData}</>}
                    </Alert>
                </>
            )}
        </>
    );
};

export { WAXPOT };
