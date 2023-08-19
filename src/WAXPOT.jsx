import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import UIManualMode from "./UIManualMode.jsx";
import UIWharfkit from "./UIWharfkit.jsx";

const WAXPOT = ({ serverGet, mode, children }) => {
    // Need to get secret/clientkey/expires/testnet from server

    const [phase, setPhase] = useState(0);
    const [serverParams, setServerParams] = useState(null);
    const [txConfirm, setTxConfirm] = useState(null);
    const [foundData, setFoundData] = useState({});
    const [tickdown, setTickdown] = useState("Loading...");
    const [syncCt, setSyncCt] = useState(0);
    const [showCancel, setShowCancel] = useState(false);
    const [autoConfirm, setAutoConfirm] = useState(true);

    const confirmHandler = async (txOverride) => {
        if (!window.WAXPOT || syncCt === 0) {
            return;
        }

        const txConfirmVal = txOverride ?? txConfirm;

        if (txConfirmVal) {
            const res = await window.WAXPOT.notifier(txConfirmVal.memo, txConfirmVal.txid);

            if (res) {
                setFoundData(res.message);
                setPhase(5);
            } else {
                setPhase(3);
                setFoundData("Failed.");
            }
        }
    };

    useEffect(() => {
        if (!window.WAXPOT || syncCt === 0) {
            return;
        }

        // TODO: move this to a child control

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
                        setTickdown(+calcTick > 0 ? calcTick + " seconds" : "Expired");
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
        return <Spinner></Spinner>;
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

    // Engine needs phases and modals.
    // Sends each one:

    const datapack = {
        setPhase,
        setAutoConfirm,
        setShowCancel,
        newChallengeHandler,
        confirmHandler,
        handleReset,
        serverParams,
        tickdown,
        showCancel,
        phase,
        foundData,
    };

    if (mode === "wharfkit") {
        return <UIWharfkit {...datapack}>{children}</UIWharfkit>;
    }

    return <UIManualMode {...datapack}>{children}</UIManualMode>;
};

export default WAXPOT;
