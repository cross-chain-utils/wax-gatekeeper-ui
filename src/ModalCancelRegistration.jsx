import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalCancelRegistration = ({ show, handelClose, handleCancelReg }) => {
    return (
        <Modal className="modal-md text-light bg-dark" show={show}>
            <Modal.Header closeButton>
                <Modal.Title>Cancel Wallet Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Closing this dialog will reset the current transfer and you
                    will get a new memo next time you open it.
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
                        handelClose(false);
                    }}
                >
                    No
                </Button>
                <Button
                    className="float-right"
                    variant="danger"
                    onClick={handleCancelReg}
                >
                    Yes
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCancelRegistration;
