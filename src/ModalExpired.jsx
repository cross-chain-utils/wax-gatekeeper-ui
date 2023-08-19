import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalExpired = ({ foundData, show, handleReset }) => {
    return (
        <Modal className="modal-md" show={show}>
            <Modal.Header>
                <Modal.Title>Link Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!foundData && (
                    <>
                        Transfer took too long and expired. Please try again.
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
    );
};

export default ModalExpired;
