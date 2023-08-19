import React, { useEffect, useState } from "react";

import { Alert, Button, Card, Badge, Spinner } from "react-bootstrap";
import { SessionKit } from "@wharfkit/session";
import { WebRenderer } from "@wharfkit/web-renderer";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginWombat } from "@wharfkit/wallet-plugin-wombat";
import { WalletPluginCloudWallet } from "@wharfkit/wallet-plugin-cloudwallet";
import { Chains } from "@wharfkit/session";

const webRenderer = new WebRenderer();

const sessionKit = new SessionKit({
    appName: "ChainLetter Wallet Link",
    chains: [Chains.WAX, Chains.WAXTestnet],
    ui: webRenderer,
    walletPlugins: [
        new WalletPluginCloudWallet(),
        new WalletPluginAnchor(),
        new WalletPluginWombat(),
    ],
});

const WharfKitLogin = ({ foundData, serverParams }) => {
    const [waxSession, setWaxSession] = React.useState(null);
    const [txresult, setTxResult] = React.useState(null);

    const getSession = async () => {
        sessionKit.chains = serverParams.testnet ? [Chains.WAXTestnet] : [Chains.WAX];
        const { session } = await sessionKit.login();
        console.log("WALLET SESSION", session, session.serialize());
        setWaxSession(session);
    };

    const sendTokens = async () => {
        const data = {
            account: "eosio.token",
            name: "transfer",
            authorization: [
                {
                    actor: waxSession.serialize().actor,
                    permission: waxSession.serialize().permission,
                },
            ],
            data: {
                from: waxSession.serialize().actor,
                to: serverParams.watchaddress,
                quantity: `${(+serverParams.fee_enforce).toFixed(8)} WAX`,
                memo: serverParams.secret,
            },
        };

        console.log("DATA", data);

        const result2 = await waxSession.transact({ action: data });
        setTxResult(result2);
    };

    return (
        <div className="mx-auto text-center">
            <h3>Connect Wallet and Transfer</h3>

            {!waxSession && (
                <>
                    <p>
                        <strong>Step 1:</strong> Connect your wallet (uses WharfKit)
                    </p>

                    <Button onClick={getSession}>Connect Wallet</Button>
                </>
            )}
            {waxSession && !txresult && (
                <>
                    {" "}
                    <>
                        <p>
                            <strong>Step 1:</strong>
                        </p>
                        <Badge style={{ fontSize: "2rem" }} variant="success">
                            <strong>Connected</strong> | {waxSession.serialize().actor}
                        </Badge>

                        <p>
                            <strong>Step 2:</strong> Complete the Proof-of-Transfer transaction by
                            sending {serverParams.fee_enforce} WAXP to {serverParams.watchaddress}{" "}
                            with memo '{serverParams.secret}'
                        </p>
                        <Button onClick={sendTokens}>Send Tokens</Button>
                    </>
                </>
            )}
            {waxSession && txresult && (
                <Alert>
                    <Spinner></Spinner> Looking for transfer...
                </Alert>
            )}
        </div>
    );
};

export default WharfKitLogin;
